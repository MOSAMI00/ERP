<?php

namespace App\Domains\Compensation\Actions;

use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use App\Shared\Settings\PlatformSettingsService;

class CreateEquipmentHandoverAction
{
    public function __construct(
        private PlatformSettingsService $settings,
    ) {}

    public function handle(RentalOperation $rental, float $lateFee): EquipmentHandover
    {
        $windowHours = $this->settings->getObjectionWindowHours();

        return EquipmentHandover::create([
            'rental_op_id'        => $rental->id,
            'actual_return_date'  => now()->toDateString(),
            'actual_rental_days'  => $rental->start_date->diffInDays(now()),
            'late_fee'            => $lateFee,
            'objection_deadline'  => now()->addHours($windowHours),
        ]);
    }
}
