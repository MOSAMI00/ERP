<?php

namespace App\Domains\Rental\Actions;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\RentalOperation;

class UpdateRentalStatusAction
{
    public function handle(RentalOperation $rental, RentalStatus $status): void
    {
        $rental->update(['status' => $status]);
    }
}
