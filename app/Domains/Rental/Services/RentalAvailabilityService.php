<?php

namespace App\Domains\Rental\Services;

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
            ->whereIn('status', ['confirmed', 'paid', 'in_use'])
            ->where(function ($q) use ($start, $end) {
                $q->whereBetween('start_date', [$start, $end])
                    ->orWhereBetween('end_date', [$start, $end])
                    ->orWhere(fn($q2) => $q2->where('start_date', '<=', $start)->where('end_date', '>=', $end));
            })->exists();

        if ($hasActiveRental) return false;

        return ! EquipmentAvailability::where('equipment_id', $equipmentId)
            ->where(fn($q) => $q->whereBetween('unavailable_from', [$start, $end])
                ->orWhereBetween('unavailable_to', [$start, $end]))
            ->exists();
    }

    public function validateForSubmit(int $equipmentId, string $startDate, string $endDate): void
    {
        if (! $this->checkAvailability($equipmentId, $startDate, $endDate)) {
            throw new \Exception('Equipment is not available for the selected dates.');
        }
        $equipment = Equipment::findOrFail($equipmentId);
        if ($equipment->status !== 'active') {
            throw new \Exception('Equipment is not active.');
        }
    }
}
