<?php

namespace App\Domains\Equipment\Actions;

use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Models\EquipmentAvailability;

class BlockAvailabilityAction
{
    public function __invoke(
        int                $equipmentId,
        string             $from,
        string             $to,
        AvailabilityReason $reason = AvailabilityReason::OwnerBlocked,
    ): EquipmentAvailability {
        $overlap = EquipmentAvailability::where('equipment_id', $equipmentId)
            ->where('unavailable_from', '<=', $to)
            ->where('unavailable_to', '>=', $from)
            ->exists();

        if ($overlap) {
            throw new \Exception('Date range overlaps with an existing blocked period.');
        }

        return EquipmentAvailability::create([
            'equipment_id'     => $equipmentId,
            'unavailable_from' => $from,
            'unavailable_to'   => $to,
            'reason'           => $reason,
        ]);
    }
}