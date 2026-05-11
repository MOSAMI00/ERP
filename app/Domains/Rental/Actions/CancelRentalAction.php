<?php

namespace App\Domains\Rental\Actions;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\RentalOperation;

class CancelRentalAction
{
    public function handle(
        RentalOperation $rental,
        string $reason,
        RentalStatus $status = RentalStatus::Cancelled
    ): void {
        $rental->update([
            'status'              => $status,
            'cancellation_reason' => $reason,
        ]);
    }
}
