<?php

namespace App\Domains\Rental\Services;

use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Shared\Exceptions\InvalidStateTransitionException;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\EquipmentAvailability;
use Carbon\Carbon;

class RentalAvailabilityService
{
    public function checkAvailability(int $equipmentId, string $startDate, string $endDate): bool
    {
        $start = Carbon::parse($startDate);
        $end   = Carbon::parse($endDate);

        $hasActiveRental = RentalOperation::where('equipment_id', $equipmentId)
            ->whereIn('status', [
                RentalStatus::Confirmed->value,
                RentalStatus::Paid->value,
                RentalStatus::InUse->value,
            ])
            ->where(function ($q) use ($start, $end) {
                $q->where('start_date', '<=', $end)
                    ->where('end_date', '>=', $start);
            })->exists();

        if ($hasActiveRental) return false;

        return ! EquipmentAvailability::where('equipment_id', $equipmentId)
            ->where('unavailable_from', '<=', $end)
            ->where('unavailable_to', '>=', $start)
            ->exists();
    }

    public function validateForSubmit(int $equipmentId, string $startDate, string $endDate): void
    {
        if (! $this->checkAvailability($equipmentId, $startDate, $endDate)) {
            throw new InvalidStateTransitionException('Equipment is not available for the selected dates.');
        }
        $equipment = Equipment::findOrFail($equipmentId);
        if ($equipment->status !== EquipmentStatus::Active) {
            throw new InvalidStateTransitionException('Equipment is not active.');
        }
    }

    public function reserveForRental(RentalOperation $rental): void
    {
        Equipment::query()->whereKey($rental->equipment_id)->lockForUpdate()->firstOrFail();

        $hasConflict = EquipmentAvailability::where('equipment_id', $rental->equipment_id)
            ->where('unavailable_from', '<=', $rental->end_date)
            ->where('unavailable_to', '>=', $rental->start_date)
            ->lockForUpdate()
            ->exists();

        if ($hasConflict) {
            throw new InvalidStateTransitionException('Equipment is no longer available for the selected dates.');
        }

        $hasRentalConflict = RentalOperation::where('equipment_id', $rental->equipment_id)
            ->whereKeyNot($rental->id)
            ->whereIn('status', [
                RentalStatus::Confirmed->value,
                RentalStatus::Paid->value,
                RentalStatus::InUse->value,
            ])
            ->where('start_date', '<=', $rental->end_date)
            ->where('end_date', '>=', $rental->start_date)
            ->lockForUpdate()
            ->exists();

        if ($hasRentalConflict) {
            throw new InvalidStateTransitionException('Equipment has a conflicting active rental.');
        }

        EquipmentAvailability::create([
            'equipment_id' => $rental->equipment_id,
            'unavailable_from' => $rental->start_date,
            'unavailable_to' => $rental->end_date,
            'reason' => AvailabilityReason::Booked->value,
        ]);
    }

    public function releaseForRental(RentalOperation $rental): void
    {
        EquipmentAvailability::where('equipment_id', $rental->equipment_id)
            ->where('unavailable_from', $rental->start_date)
            ->where('unavailable_to', $rental->end_date)
            ->where('reason', AvailabilityReason::Booked->value)
            ->delete();
    }
}
