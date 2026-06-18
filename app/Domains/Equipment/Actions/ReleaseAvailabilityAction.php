<?php

namespace App\Domains\Equipment\Actions;

use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Models\EquipmentAvailability;

class ReleaseAvailabilityAction
{
    public function __invoke(
        int                $equipmentId,
        string             $from,
        string             $to,
        AvailabilityReason $reason = AvailabilityReason::Booked,
    ): void {
        EquipmentAvailability::where('equipment_id', $equipmentId)
            ->where('unavailable_from', $from)
            ->where('unavailable_to', $to)
            ->where('reason', $reason)
            ->delete();
    }
}