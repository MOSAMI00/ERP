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
        $rentalPayment = $rental->payments()
            ->where('type', PaymentType::Rental)
            ->where('status', PaymentStatus::Paid)
            ->firstOrFail();

        $ownerAmount = $rentalPayment->amount
            - $rentalPayment->platform_fee
            - $rental->insurance_amount;

        Payment::create([
            'rental_op_id'   => $rental->id,
            'type'           => PaymentType::OwnerTransfer,
            'amount'         => $ownerAmount,
            'platform_fee'   => 0,
            'status'         => PaymentStatus::Paid,
            'escrow_status'  => null,
            'transferred_at' => now(),
        ]);
    }
}
