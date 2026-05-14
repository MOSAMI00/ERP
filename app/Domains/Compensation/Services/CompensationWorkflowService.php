<?php

namespace App\Domains\Compensation\Services;

use App\Domains\Compensation\Actions\AcceptCompensationAction;
use App\Domains\Compensation\Actions\AutoSettleAfterDeadlineAction;
use App\Domains\Compensation\Actions\CalculateLateFeeAction;
use App\Domains\Compensation\Actions\CreateEquipmentHandoverAction;
use App\Domains\Compensation\Actions\RequestCompensationAction;
use App\Domains\Compensation\Enums\OwnerDecision;
use App\Domains\Handover\Enums\HandoverPhase;
use App\Domains\Payment\Services\PaymentWorkflowService;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalStateResolver;
use App\Domains\Shared\Exceptions\DuplicateOperationException;
use App\Domains\Shared\Exceptions\InvalidStateTransitionException;
use App\Domains\Shared\Exceptions\PaymentException;
use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use App\Shared\Settings\PlatformSettingsService;
use Illuminate\Support\Facades\DB;

class CompensationWorkflowService
{
    public function __construct(
        private CreateEquipmentHandoverAction  $createHandover,
        private CalculateLateFeeAction         $calculateLateFee,
        private RequestCompensationAction      $requestCompensation,
        private AcceptCompensationAction       $acceptCompensation,
        private AutoSettleAfterDeadlineAction  $autoSettle,
        private UpdateRentalStatusAction       $updateRentalStatus,
        private RentalStateResolver            $stateResolver,
        private PaymentWorkflowService         $paymentWorkflow,
        private PlatformSettingsService        $settings,
        private NotificationService            $notifications,
        private AuditLogService                $audit,
    ) {}

    // ══════════════════════════════════════════
    // [9] تقييم الإرجاع — ينشئ EQUIPMENT_HANDOVER
    // يُستدعى بعد submitOwnerReturnReport()
    // ══════════════════════════════════════════
    public function evaluate(RentalOperation $rental): EquipmentHandover
    {
        $this->stateResolver->canRequestCompensation($rental);
        $this->mustNotHaveHandover($rental);
        $this->mustHaveReturnReports($rental);

        $handover = DB::transaction(function () use ($rental) {
            $lateFee = $this->calculateLateFee->handle($rental);
            $handover = $this->createHandover->handle($rental, $lateFee);
            $this->audit->log('equipment_handover_evaluated', $rental);
            return $handover;
        });

        // ✦ If no issues and no insurance, we can complete immediately
        if ((float)$handover->late_fee <= 0 && ! $this->mustHaveEquipmentHandover($rental)) {
            $this->skipCompensation($handover);
        } else {
            $this->notifications->notifyOwner($rental, 'equipment_evaluated');
        }

        return $handover;
    }

    // ══════════════════════════════════════════
    // [9A] لا يوجد تعويض — Happy Path
    // ══════════════════════════════════════════
    public function skipCompensation(EquipmentHandover $handover): void
    {
        $this->mustBePendingDecision($handover);

        DB::transaction(function () use ($handover) {
            // ✦ تسجيل قرار المؤجر
            $this->acceptCompensation->handle($handover, OwnerDecision::FullRefund);

            // ✦ تحريك الأموال
            $this->paymentWorkflow->releaseFundsHappyPath($handover->rental);

            // ✦ CompensationWorkflow هو من يُنهي دورة الإيجار
            $this->updateRentalStatus->handle($handover->rental, RentalStatus::Completed);

            $this->audit->log('compensation_skipped', $handover->rental);
        });

        $this->notifications->notifyBoth($handover->rental, 'rental_completed');
    }

    // ══════════════════════════════════════════
    // [9B] المؤجر يطلب تعويضاً
    // ══════════════════════════════════════════
    public function requestCompensation(
        EquipmentHandover $handover,
        float $proposedDeduction,
        string $notes
    ): void {
        $this->mustBePendingDecision($handover);
        $this->validateDeductionAmount($handover->rental, $proposedDeduction);

        $windowHours = $this->settings->getObjectionWindowHours();
        
        $decision = $proposedDeduction >= (float)$handover->rental->insurance_amount
            ? OwnerDecision::NoRefund
            : OwnerDecision::PartialRefund;

        DB::transaction(function () use ($handover, $decision, $proposedDeduction, $notes, $windowHours) {
            $this->requestCompensation->handle($handover, $decision, $proposedDeduction, $notes, $windowHours);
            $this->updateRentalStatus->handle($handover->rental, RentalStatus::CompensationRequested);
            $this->audit->log('compensation_requested', $handover->rental);
        });

        $this->notifications->notifyTenant($handover->rental, 'compensation_requested');
    }

    // ══════════════════════════════════════════
    // [10A] المستأجر يقبل التعويض
    // ══════════════════════════════════════════
    public function acceptCompensation(EquipmentHandover $handover): void
    {
        $this->mustBeWithinObjectionWindow($handover);
        $this->mustBePendingTenantResponse($handover);

        DB::transaction(function () use ($handover) {
            // ✦ تسجيل القرار
            $this->acceptCompensation->handle($handover, OwnerDecision::PartialRefund);

            // ✦ إغلاق أي نزاع مفتوح مرتبط
            $handover->rental->dispute()->where('status', 'open')->update([
                'status' => 'resolved',
                'admin_note' => 'Settled by tenant acceptance.',
                'resolved_at' => now(),
            ]);

            // ✦ تحريك الأموال مع الخصم
            $this->paymentWorkflow->releaseFundsWithDeduction(
                $handover->rental,
                $handover->proposed_deduction,
            );

            // ✦ CompensationWorkflow يُنهي دورة الإيجار
            $this->updateRentalStatus->handle($handover->rental, RentalStatus::Completed);

            $this->audit->log('compensation_accepted_by_tenant', $handover->rental);
        });

        $this->notifications->notifyBoth($handover->rental, 'compensation_settled');
    }

    // ══════════════════════════════════════════
    // [10B] انتهت نافذة الاعتراض — صمت = قبول
    // يُستدعى من Cron Job
    // ══════════════════════════════════════════
    public function autoSettleExpired(EquipmentHandover $handover): void
    {
        if (! $this->isObjectionWindowExpired($handover)) {
            return;
        }

        if (! $this->isPendingTenantResponse($handover)) {
            return;
        }

        DB::transaction(function () use ($handover) {
            // ✦ تسجيل التسوية التلقائية
            $this->autoSettle->handle($handover, OwnerDecision::PartialRefund);

            // ✦ تحريك الأموال مع الخصم
            $this->paymentWorkflow->releaseFundsWithDeduction(
                $handover->rental,
                $handover->proposed_deduction,
            );

            // ✦ CompensationWorkflow يُنهي دورة الإيجار
            $this->updateRentalStatus->handle($handover->rental, RentalStatus::Completed);

            $this->audit->log('compensation_auto_settled', $handover->rental);
        });

        $this->notifications->notifyBoth($handover->rental, 'compensation_auto_settled');
    }

    // ══════════════════════════════════════════
    // [10C] المستأجر يرفض — ينتقل للنزاع
    // يُستدعى من DisputeWorkflowService
    // ══════════════════════════════════════════
    public function escalateToDispute(EquipmentHandover $handover): void
    {
        $this->mustBeWithinObjectionWindow($handover);

        DB::transaction(function () use ($handover) {
            // ✦ تجميد الأموال تبقى في escrow
            $handover->update(['objection_submitted_at' => now()]);
            $this->updateRentalStatus->handle($handover->rental, RentalStatus::Disputed);
            $this->audit->log('rental_escalated_to_dispute', $handover->rental);
        });

        $this->notifications->notifyBoth($handover->rental, 'dispute_opened');
    }

    // ══════════════════════════════════════════
    // Private helpers
    // ══════════════════════════════════════════

    private function mustNotHaveHandover(RentalOperation $rental): void
    {
        if ($rental->equipmentHandover()->exists()) {
            throw DuplicateOperationException::forModel('EquipmentHandover', $rental->id);
        }
    }

    private function mustHaveEquipmentHandover(RentalOperation $rental): bool
    {
        // If there's an insurance amount, we always need a decision phase
        if ((float)$rental->insurance_amount > 0) return true;

        // If the owner reported any damage/issues, we need a decision phase
        $ownerReport = $rental->handoverReports()
            ->where('phase', HandoverPhase::Return->value)
            ->where('submitted_by_role', 'owner')
            ->first();

        return $ownerReport && ($ownerReport->condition_status !== ConditionStatus::Good || $ownerReport->has_issues);
    }

    private function mustHaveReturnReports(RentalOperation $rental): void
    {
        $tenantSubmitted = $rental->handoverReports()
            ->where('phase', HandoverPhase::Return->value)
            ->where('submitted_by_id', $rental->tenant_id)
            ->exists();

        $ownerSubmitted = $rental->handoverReports()
            ->where('phase', HandoverPhase::Return->value)
            ->where('submitted_by_id', $rental->owner_id)
            ->exists();

        if (! $tenantSubmitted || ! $ownerSubmitted) {
            throw new InvalidStateTransitionException('Both return handover reports are required before compensation evaluation.');
        }
    }

    private function mustBePendingDecision(EquipmentHandover $handover): void
    {
        if ($handover->owner_decision !== null) {
            throw InvalidStateTransitionException::expected('pending decision', $handover->owner_decision->value ?? 'decided');
        }
    }

    private function mustBeWithinObjectionWindow(EquipmentHandover $handover): void
    {
        if ($this->isObjectionWindowExpired($handover)) {
            throw InvalidStateTransitionException::expected('within objection window', 'expired');
        }
    }

    private function isObjectionWindowExpired(EquipmentHandover $handover): bool
    {
        return $handover->objection_deadline !== null
            && now()->isAfter($handover->objection_deadline);
    }

    private function isPendingTenantResponse(EquipmentHandover $handover): bool
    {
        return $handover->owner_decision !== null 
            && $handover->owner_decision !== OwnerDecision::FullRefund
            && $handover->rental->status !== RentalStatus::Completed;
    }

    private function mustBePendingTenantResponse(EquipmentHandover $handover): void
    {
        if (! $this->isPendingTenantResponse($handover)) {
            throw new InvalidStateTransitionException('There is no pending tenant compensation response.');
        }
    }

    private function validateDeductionAmount(
        RentalOperation $rental,
        float $deductionAmount
    ): void {
        if ($deductionAmount < 0) {
            throw PaymentException::invalidAmount('Deduction amount cannot be negative.');
        }

        if ($rental->insurance_amount > 0 && $deductionAmount > (float)$rental->insurance_amount) {
            throw PaymentException::deductionExceedsInsurance($deductionAmount, (float)$rental->insurance_amount);
        }
    }
}
