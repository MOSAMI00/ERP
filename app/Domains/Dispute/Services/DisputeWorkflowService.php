<?php

namespace App\Domains\Dispute\Services;

use App\Domains\Compensation\Services\CompensationWorkflowService;
use App\Domains\Dispute\Actions\CreateDisputeAction;
use App\Domains\Dispute\Actions\ResolveDisputeAction;
use App\Domains\Dispute\Enums\AdminDecision;
use App\Domains\Dispute\Enums\DisputeStatus;
use App\Domains\Payment\Services\PaymentWorkflowService;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalStateResolver;
use App\Models\Admin;
use App\Models\Dispute;
use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use App\Models\User;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use Illuminate\Support\Facades\DB;

class DisputeWorkflowService
{
    public function __construct(
        private CreateDisputeAction          $createDispute,
        private ResolveDisputeAction         $resolveDispute,
        private UpdateRentalStatusAction     $updateRentalStatus,
        private RentalStateResolver          $stateResolver,
        private CompensationWorkflowService  $compensationWorkflow,
        private PaymentWorkflowService       $paymentWorkflow,
        private NotificationService          $notifications,
        private AuditLogService              $audit,
    ) {}

    // ══════════════════════════════════════════
    // [10C] المستأجر يرفض ويفتح نزاعاً
    // ══════════════════════════════════════════
    public function openDispute(
        EquipmentHandover $handover,
        User $tenant,
        string $tenantClaim,
        float $requestedAmount,
    ): Dispute {
        $this->mustBeRentalTenant($handover, $tenant);
        $this->stateResolver->canOpenDispute($handover->rental);
        $this->validateRequestedAmount($handover->rental, $requestedAmount);

        // ✦ Duplicate protection
        $this->mustNotHaveDispute($handover->rental);

        $dispute = DB::transaction(function () use ($handover, $tenant, $tenantClaim, $requestedAmount) {
            // ✦ تحويل حالة الإيجار إلى Disputed
            $this->compensationWorkflow->escalateToDispute($handover);

            $dispute = $this->createDispute->handle(
                rental:          $handover->rental,
                handover:        $handover,
                raisedBy:        $tenant,
                tenantClaim:     $tenantClaim,
                requestedAmount: $requestedAmount,
            );

            $this->audit->log('dispute_opened', $handover->rental);

            return $dispute;
        });

        $this->notifications->notifyOwner($handover->rental, 'dispute_opened');
        $this->notifications->notifyAdmins('new_dispute_requires_review');

        return $dispute;
    }

    // ══════════════════════════════════════════
    // [11] الإدارة تبدأ المراجعة
    // ══════════════════════════════════════════
    public function startReview(Dispute $dispute, Admin $admin): void
    {
        $this->mustBeOpen($dispute);

        DB::transaction(function () use ($dispute, $admin) {
            $this->resolveDispute->updateStatus($dispute, DisputeStatus::UnderReview);
            $this->audit->log('dispute_review_started', $dispute->rental);
        });

        $this->notifications->notifyBoth($dispute->rental, 'dispute_under_review');
    }

    // ══════════════════════════════════════════
    // [12A] الإدارة تقبل خصم المؤجر كاملاً
    // ══════════════════════════════════════════
    public function acceptDeduction(
        Dispute $dispute,
        Admin $admin,
        string $adminNote,
    ): void {
        $this->mustBeUnderReview($dispute);

        DB::transaction(function () use ($dispute, $admin, $adminNote) {
            $this->resolveDispute->handle(
                dispute:       $dispute,
                resolvedBy:    $admin,
                decision:      AdminDecision::AcceptDeduction,
                compensation:  $dispute->handover->proposed_deduction,
                note:          $adminNote,
            );

            // ✦ تحريك الأموال بالخصم المقترح من المؤجر
            $this->paymentWorkflow->releaseFundsWithDeduction(
                $dispute->rental,
                $dispute->handover->proposed_deduction,
            );

            $this->updateRentalStatus->handle($dispute->rental, RentalStatus::Completed);

            $this->audit->log('dispute_resolved_accept_deduction', $dispute->rental);
        });

        $this->notifications->notifyBoth($dispute->rental, 'dispute_resolved');
    }

    // ══════════════════════════════════════════
    // [12B] الإدارة ترفض خصم المؤجر — تعويض كامل للمستأجر
    // ══════════════════════════════════════════
    public function rejectDeduction(
        Dispute $dispute,
        Admin $admin,
        string $adminNote,
    ): void {
        $this->mustBeUnderReview($dispute);

        DB::transaction(function () use ($dispute, $admin, $adminNote) {
            $this->resolveDispute->handle(
                dispute:      $dispute,
                resolvedBy:   $admin,
                decision:     AdminDecision::RejectDeduction,
                compensation: 0,
                note:         $adminNote,
            );

            // ✦ تعويض كامل — لا خصم
            $this->paymentWorkflow->releaseFundsHappyPath($dispute->rental);

            $this->updateRentalStatus->handle($dispute->rental, RentalStatus::Completed);

            $this->audit->log('dispute_resolved_reject_deduction', $dispute->rental);
        });

        $this->notifications->notifyBoth($dispute->rental, 'dispute_resolved');
    }

    // ══════════════════════════════════════════
    // [12C] الإدارة تعدّل مبلغ التعويض
    // ══════════════════════════════════════════
    public function modifyCompensation(
        Dispute $dispute,
        Admin $admin,
        float $finalCompensation,
        string $adminNote,
    ): void {
        $this->mustBeUnderReview($dispute);

        // ✦ المبلغ المعدّل لا يتجاوز التأمين
        $this->validateCompensationAmount($dispute, $finalCompensation);

        DB::transaction(function () use ($dispute, $admin, $finalCompensation, $adminNote) {
            $this->resolveDispute->handle(
                dispute:      $dispute,
                resolvedBy:   $admin,
                decision:     AdminDecision::ModifyCompensation,
                compensation: $finalCompensation,
                note:         $adminNote,
            );

            // ✦ تحريك الأموال بالمبلغ المعدّل
            $this->paymentWorkflow->releaseFundsWithDeduction(
                $dispute->rental,
                $finalCompensation,
            );

            $this->updateRentalStatus->handle($dispute->rental, RentalStatus::Completed);

            $this->audit->log('dispute_resolved_modified_compensation', $dispute->rental);
        });

        $this->notifications->notifyBoth($dispute->rental, 'dispute_resolved');
    }

    // ══════════════════════════════════════════
    // Private helpers
    // ══════════════════════════════════════════

    private function mustNotHaveDispute(RentalOperation $rental): void
    {
        if ($rental->dispute()->exists()) {
            throw new \DomainException(
                "Rental [{$rental->id}] already has an open dispute."
            );
        }
    }

    private function mustBeRentalTenant(EquipmentHandover $handover, User $tenant): void
    {
        if ((int) $handover->rental->tenant_id !== (int) $tenant->id) {
            throw new \DomainException('Only the rental tenant can open a dispute.');
        }
    }

    private function mustBeOpen(Dispute $dispute): void
    {
        if ($dispute->status !== DisputeStatus::Open) {
            throw new \DomainException(
                "Expected dispute status [open], got [{$dispute->status->value}]."
            );
        }
    }

    private function mustBeUnderReview(Dispute $dispute): void
    {
        if ($dispute->status !== DisputeStatus::UnderReview) {
            throw new \DomainException(
                "Expected dispute status [under_review], got [{$dispute->status->value}]."
            );
        }
    }

    private function validateCompensationAmount(
        Dispute $dispute,
        float $finalCompensation
    ): void {
        if ($finalCompensation < 0) {
            throw new \DomainException('Compensation amount cannot be negative.');
        }

        if ($finalCompensation > $dispute->rental->insurance_amount) {
            throw new \DomainException(
                "Compensation [{$finalCompensation}] exceeds insurance [{$dispute->rental->insurance_amount}]."
            );
        }
    }

    private function validateRequestedAmount(
        RentalOperation $rental,
        float $requestedAmount
    ): void {
        if ($requestedAmount < 0) {
            throw new \DomainException('Requested amount cannot be negative.');
        }

        if ($requestedAmount > $rental->insurance_amount) {
            throw new \DomainException(
                "Requested amount [{$requestedAmount}] exceeds insurance [{$rental->insurance_amount}]."
            );
        }
    }
}
