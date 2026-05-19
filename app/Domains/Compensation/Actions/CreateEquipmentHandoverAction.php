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

        $ownerReport = $rental->handoverReports()
            ->where('phase', 'return')
            ->where('submitted_by_role', 'owner')
            ->first();

        $finalCondition = $ownerReport ? $ownerReport->condition_status : \App\Domains\Handover\Enums\ConditionStatus::Good;

        return EquipmentHandover::create([
            'rental_op_id'        => $rental->id,
            'actual_return_date'  => now()->toDateString(),
            'actual_rental_days'  => $rental->start_date->diffInDays(now()),
            'late_fee'            => $lateFee,
            'objection_deadline'  => now()->addHours($windowHours),
            'final_condition'     => $finalCondition,
        ]);
    }
}
