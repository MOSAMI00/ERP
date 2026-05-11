<?php

namespace App\Domains\Rental\Actions;

use App\Models\RentalOperation;

class SetPaymentDeadlineAction
{
    public function handle(RentalOperation $rental, int $hours): void
    {
        $rental->update([
            'payment_deadline' => now()->addHours($hours),
        ]);
    }
}