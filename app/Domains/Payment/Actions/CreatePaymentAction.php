<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\Payment;
use App\Models\RentalOperation;

class CreatePaymentAction
{
    public function handle(
        RentalOperation $rental,
        array $paymentData,
        float $feeRate
    ): Payment {
        $platformFee = round($rental->rental_amount * $feeRate, 2);

        return Payment::create([
            'rental_op_id'    => $rental->id,
            'type'            => PaymentType::Rental->value,
            'amount'          => $rental->total_amount,
            'platform_fee'    => $platformFee,
            'status'          => PaymentStatus::Pending->value,
            'payer_id'         => $rental->tenant_id,
            'payment_method'  => $paymentData['payment_method'],
            'transaction_ref' => $paymentData['transaction_ref'] ?? null,
            'escrow_status'   => EscrowStatus::Held->value,
        ]);
    }
}
