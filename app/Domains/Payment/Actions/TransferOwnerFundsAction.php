<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\Payment;
use App\Models\RentalOperation;

class TransferOwnerFundsAction
{
    public function handle(RentalOperation $rental): void
    {
        if ($rental->payments()
            ->where('type', PaymentType::OwnerTransfer->value)
            ->where('status', PaymentStatus::Paid->value)
            ->exists()
        ) {
            return;
        }

        $rentalPayment = $rental->payments()
            ->where('type', PaymentType::Rental->value)
            ->where('status', PaymentStatus::Paid->value)
            ->firstOrFail();

        $ownerAmount = (float) $rentalPayment->amount
            - (float) $rentalPayment->platform_fee
            - (float) $rental->insurance_amount;

        Payment::create([
            'rental_op_id'   => $rental->id,
            'type'           => PaymentType::OwnerTransfer->value,
            'amount'         => $ownerAmount,
            'platform_fee'   => 0,
            'status'         => PaymentStatus::Paid->value,
            'escrow_status'  => null,
            'transferred_at' => now(),
        ]);
    }
}
