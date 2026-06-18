<?php

namespace App\Domains\Equipment\Services;

use App\Domains\Equipment\Actions\BlockAvailabilityAction;
use App\Domains\Equipment\Actions\ReleaseAvailabilityAction;
use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Domains\Rental\Enums\RentalStatus;
use App\Models\EquipmentAvailability;
use App\Models\RentalOperation;

class EquipmentAvailabilityService
{
    public function __construct(
        private BlockAvailabilityAction   $blockAction,
        private ReleaseAvailabilityAction $releaseAction,
    ) {}

    public function getUnavailableDates(int $equipmentId): array
    {
        return [
            'rented'  => RentalOperation::where('equipment_id', $equipmentId)
                ->whereIn('status', [
                    RentalStatus::Confirmed->value,
                    RentalStatus::Paid->value,
                    RentalStatus::InUse->value,
                ])
                ->get(['start_date', 'end_date'])
                ->toArray(),
            'blocked' => EquipmentAvailability::where('equipment_id', $equipmentId)
                ->get(['unavailable_from', 'unavailable_to', 'reason'])
                ->toArray(),
        ];
    }

    public function isAvailable(int $equipmentId, string $from, string $to): bool
    {
        $conflict = EquipmentAvailability::where('equipment_id', $equipmentId)
            ->where('unavailable_from', '<=', $to)
            ->where('unavailable_to', '>=', $from)
            ->exists();

        $rented = RentalOperation::where('equipment_id', $equipmentId)
            ->whereIn('status', [
                RentalStatus::Confirmed->value,
                RentalStatus::Paid->value,
                RentalStatus::InUse->value,
            ])
            ->where('start_date', '<=', $to)
            ->where('end_date', '>=', $from)
            ->exists();

        return ! $conflict && ! $rented;
    }

    public function blockForRental(int $equipmentId, string $from, string $to): EquipmentAvailability
    {
        return ($this->blockAction)($equipmentId, $from, $to, AvailabilityReason::Booked);
    }

    public function releaseAfterRental(int $equipmentId, string $from, string $to): void
    {
        ($this->releaseAction)($equipmentId, $from, $to, AvailabilityReason::Booked);
    }

    public function ownerBlock(int $equipmentId, string $from, string $to): EquipmentAvailability
    {
        return ($this->blockAction)($equipmentId, $from, $to, AvailabilityReason::OwnerBlocked);
    }

    public function ownerRelease(int $equipmentId, string $from, string $to): void
    {
        ($this->releaseAction)($equipmentId, $from, $to, AvailabilityReason::OwnerBlocked);
    }
}
