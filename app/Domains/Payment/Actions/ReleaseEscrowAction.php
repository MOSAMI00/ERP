<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\Payment;
use App\Models\RentalOperation;

class ReleaseEscrowAction
{
    public function handle(RentalOperation $rental): void
    {
        $rental->payments()
            ->where('type', PaymentType::Rental->value)
            ->where('escrow_status', EscrowStatus::Held->value)
            ->update([
                'escrow_status'  => EscrowStatus::Released->value,
                'transferred_at' => now(),
            ]);
    }
}
