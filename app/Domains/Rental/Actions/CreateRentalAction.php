<?php

namespace App\Domains\Rental\Actions;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\User;
use Carbon\Carbon;

class CreateRentalAction
{
    public function handle(array $data, User $tenant): RentalOperation
    {
        $equipment = Equipment::findOrFail($data['equipment_id']);

        if ((int) $equipment->owner_id === (int) $tenant->id) {
            throw new \DomainException('Owner cannot rent their own equipment.');
        }

        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $durationDays = max(1, $start->diffInDays($end));
        $rentalAmount = (float) $equipment->price_per_day * $durationDays;

        return RentalOperation::create([
            'tenant_id'        => $tenant->id,
            'owner_id'         => $equipment->owner_id,
            'equipment_id'     => $equipment->id,
            'start_date'       => $data['start_date'],
            'end_date'         => $data['end_date'],
            'duration_days'    => $durationDays,
            'rental_amount'    => $rentalAmount,
            'insurance_amount' => $equipment->insurance_amount,
            'total_amount'     => $rentalAmount + (float) $equipment->insurance_amount,
            'delivery_location' => $data['delivery_location'],
            'status'           => RentalStatus::Pending,
        ]);
    }
}
