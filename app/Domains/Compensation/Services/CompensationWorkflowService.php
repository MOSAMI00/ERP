<?php

namespace App\Domains\Compensation\Services;

use App\Domains\Compensation\Actions\AcceptCompensationAction;
use App\Domains\Compensation\Actions\AutoSettleAfterDeadlineAction;
use App\Domains\Compensation\Actions\CalculateLateFeeAction;
use App\Domains\Compensation\Actions\CreateEquipmentHandoverAction;
use App\Domains\Compensation\Actions\RequestCompensationAction;
use App\Domains\Compensation\Enums\OwnerDecision;
use App\Domains\Payment\Services\PaymentWorkflowService;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalStateResolver;
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

        $handover = DB::transaction(function () use ($rental) {
            // TODO: Define if late_fee is auto-deducted or added to proposed_deduction
            $lateFee = $this->calculateLateFee->handle($rental);

            $handover = $this->createHandover->handle($rental, $lateFee);

            $this->audit->log('equipment_handover_evaluated', $rental);

            return $handover;
        });

        $this->notifications->notifyOwner($rental, 'equipment_evaluated');

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

        DB::transaction(function () use ($handover, $proposedDeduction, $notes, $windowHours) {
            $this->requestCompensation->handle($handover, $proposedDeduction, $notes, $windowHours);
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

        DB::transaction(function () use ($handover) {
            // ✦ تسجيل القرار
            $this->acceptCompensation->handle($handover, OwnerDecision::PartialRefund);

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
            throw new \DomainException(
                "Rental [{$rental->id}] already has an equipment handover record."
            );
        }
    }

    private function mustBePendingDecision(EquipmentHandover $handover): void
    {
        if ($handover->owner_decision !== null) {
            throw new \DomainException(
                "Handover [{$handover->id}] already has a decision: [{$handover->owner_decision->value}]"
            );
        }
    }

    private function mustBeWithinObjectionWindow(EquipmentHandover $handover): void
    {
        if ($this->isObjectionWindowExpired($handover)) {
            throw new \DomainException(
                "Objection window for handover [{$handover->id}] has expired."
            );
        }
    }

    private function isObjectionWindowExpired(EquipmentHandover $handover): bool
    {
        return $handover->objection_deadline !== null
            && now()->isAfter($handover->objection_deadline);
    }

    private function isPendingTenantResponse(EquipmentHandover $handover): bool
    {
        return $handover->owner_decision === null
            && $handover->proposed_deduction > 0;
    }

    private function validateDeductionAmount(
        RentalOperation $rental,
        float $deductionAmount
    ): void {
        if ($deductionAmount < 0) {
            throw new \DomainException('Deduction amount cannot be negative.');
        }

        if ($deductionAmount > $rental->insurance_amount) {
            throw new \DomainException(
                "Deduction [{$deductionAmount}] exceeds insurance [{$rental->insurance_amount}]."
            );
        }
    }
}