<?php

namespace App\Domains\Payment\Services;

use App\Domains\Payment\Actions\CreatePaymentAction;
use App\Domains\Payment\Actions\HoldEscrowAction;
use App\Domains\Payment\Actions\ReleaseEscrowAction;
use App\Domains\Payment\Actions\RefundInsuranceAction;
use App\Domains\Payment\Actions\TransferOwnerFundsAction;
use App\Domains\Payment\Actions\UpdatePaymentStatusAction;
use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalStateResolver;
use App\Models\Payment;
use App\Models\RentalOperation;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use App\Shared\Settings\PlatformSettingsService;
use Illuminate\Support\Facades\DB;

class PaymentWorkflowService
{
    public function __construct(
        private CreatePaymentAction       $createPayment,
        private UpdatePaymentStatusAction $updatePaymentStatus,
        private HoldEscrowAction          $holdEscrow,
        private ReleaseEscrowAction       $releaseEscrow,
        private RefundInsuranceAction     $refundInsurance,
        private TransferOwnerFundsAction  $transferOwnerFunds,
        private UpdateRentalStatusAction  $updateRentalStatus,
        private RentalStateResolver       $stateResolver,
        private EscrowService             $escrow,
        private PlatformSettingsService   $settings,
        private NotificationService       $notifications,
        private AuditLogService           $audit,
    ) {}

    // ══════════════════════════════════════════
    // [5A] المستأجر يدفع
    // ══════════════════════════════════════════
    public function processPayment(RentalOperation $rental, array $paymentData): Payment
    {
        $payment = DB::transaction(function () use ($rental, $paymentData) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->canPay($rental);

            $existing = $rental->payments()
                ->where('type', PaymentType::Rental->value)
                ->where('status', PaymentStatus::Paid->value)
                ->lockForUpdate()
                ->latest()
                ->first();

            if ($existing) {
                return $existing;
            }

            $feeRate = $this->settings->getPlatformFeeRate();

            $payment = $this->createPayment->handle($rental, $paymentData, $feeRate);
            $this->holdEscrow->handle($payment);
            $this->updatePaymentStatus->handle($payment, PaymentStatus::Paid);
            $this->updateRentalStatus->handle($rental, RentalStatus::Paid);
            $this->audit->log('payment_processed', $rental);

            return $payment;
        });

        $this->notifications->notifyOwner($rental, 'payment_received');
        $this->notifications->notifyTenant($rental, 'payment_confirmed');

        return $payment;
    }

    // ══════════════════════════════════════════
    // [9A] إفراج عن الأموال — Happy Path
    // ══════════════════════════════════════════
    // ✦ releaseFundsHappyPath — يحرك الأموال فقط
    public function releaseFundsHappyPath(RentalOperation $rental): void
    {
        DB::transaction(function () use ($rental) {
            $this->transferOwnerFunds->handle($rental);
            $this->refundInsurance->handle($rental, deduction: 0);
            $this->releaseEscrow->handle($rental);
            // ✦ لا Completed هنا — CompensationWorkflow مسؤول عنها
            $this->audit->log('funds_released_happy_path', $rental);
        });

        $this->notifications->notifyOwner($rental, 'funds_transferred');
        $this->notifications->notifyTenant($rental, 'insurance_refunded');
    }

    // ✦ releaseFundsWithDeduction — يحرك الأموال فقط
    public function releaseFundsWithDeduction(
        RentalOperation $rental,
        float $deductionAmount
    ): void {
        $this->validateDeductionAmount($rental, $deductionAmount);

        DB::transaction(function () use ($rental, $deductionAmount) {
            $this->transferOwnerFunds->handle($rental);
            $this->refundInsurance->handle($rental, deduction: $deductionAmount);
            $this->releaseEscrow->handle($rental);
            // ✦ لا Completed هنا — CompensationWorkflow مسؤول عنها
            $this->audit->log('funds_released_with_deduction', $rental);
        });

        $this->notifications->notifyOwner($rental, 'funds_transferred');
        $this->notifications->notifyTenant($rental, 'insurance_partial_refund');
    }

    // ══════════════════════════════════════════
    // [5B/5C/5D] استرداد عند الإلغاء
    // ══════════════════════════════════════════
    public function refundOnCancellation(RentalOperation $rental): void
    {
        $payment = $rental->payments()
            ->where('type', PaymentType::Rental->value)
            ->where('status', PaymentStatus::Paid->value)
            ->latest()
            ->first();

        if (! $payment) {
            return;
        }

        DB::transaction(function () use ($rental, $payment) {
            $this->escrow->refundToTenant($payment, (float) $payment->amount);
            $payment->update(['escrow_status' => EscrowStatus::Refunded->value]);
            $this->updatePaymentStatus->handle($payment, PaymentStatus::Refunded);
            $this->audit->log('payment_refunded_on_cancel', $rental);
        });

        $this->notifications->notifyTenant($rental, 'payment_refunded');
    }

    // ══════════════════════════════════════════
    // Private helpers
    // ══════════════════════════════════════════

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
