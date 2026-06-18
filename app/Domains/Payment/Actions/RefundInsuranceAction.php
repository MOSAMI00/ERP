<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\Payment;
use App\Models\RentalOperation;

class RefundInsuranceAction
{
    public function handle(RentalOperation $rental, float $deduction): void
    {
        if ($rental->payments()
            ->where('type', PaymentType::InsuranceRefund->value)
            ->where('status', PaymentStatus::Paid->value)
            ->exists()
        ) {
            return;
        }

        $refundAmount = max(0, (float) $rental->insurance_amount - $deduction);

        Payment::create([
            'rental_op_id'   => $rental->id,
            'type'           => PaymentType::InsuranceRefund->value,
            'amount'         => $refundAmount,
            'platform_fee'   => 0,
            'status'         => PaymentStatus::Paid->value,
            'escrow_status'  => EscrowStatus::Refunded->value,
            'transferred_at' => now(),
        ]);

        // ✦ تعويض المؤجر بمقدار الخصم إذا وُجد
        if ($deduction > 0) {
            Payment::create([
                'rental_op_id'   => $rental->id,
                'type'           => PaymentType::Compensation->value,
                'amount'         => $deduction,
                'platform_fee'   => 0,
                'status'         => PaymentStatus::Paid->value,
                'escrow_status'  => EscrowStatus::Released->value,
                'transferred_at' => now(),
            ]);
        }
    }
}
