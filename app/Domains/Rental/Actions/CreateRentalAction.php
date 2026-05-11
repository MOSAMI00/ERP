<?php

namespace App\Domains\Rental\Actions;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\RentalOperation;
use App\Models\User;

class CreateRentalAction
{
    public function handle(array $data, User $tenant): RentalOperation
    {
        return RentalOperation::create([
            'tenant_id'        => $tenant->id,
            'owner_id'         => $data['owner_id'],
            'equipment_id'     => $data['equipment_id'],
            'start_date'       => $data['start_date'],
            'end_date'         => $data['end_date'],
            'duration_days'    => $data['duration_days'],
            'rental_amount'    => $data['rental_amount'],
            'insurance_amount' => $data['insurance_amount'],
            'total_amount'     => $data['rental_amount'] + $data['insurance_amount'],
            'delivery_location' => $data['delivery_location'],
            'status'           => RentalStatus::Pending,
        ]);
    }
}
