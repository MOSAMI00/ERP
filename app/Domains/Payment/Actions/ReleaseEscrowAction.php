<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Models\Payment;
use App\Models\RentalOperation;

class ReleaseEscrowAction
{
    public function handle(RentalOperation $rental): void
    {
        $rental->payments()
            ->where('escrow_status', EscrowStatus::Held)
            ->update([
                'escrow_status'  => EscrowStatus::Released,
                'transferred_at' => now(),
            ]);
    }
}