<?php

namespace App\Domains\Equipment\Services;

use App\Domains\Equipment\Actions\CreateEquipmentAction;
use App\Domains\Equipment\Actions\UpdateEquipmentStatusAction;
use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Shared\Audit\AuditLogService;
use App\Models\Equipment;
use App\Models\User;

class EquipmentManagementService
{
    public function __construct(
        private CreateEquipmentAction       $createEquipmentAction,
        private UpdateEquipmentStatusAction $updateStatus,
        private AuditLogService             $audit,
    ) {}

    public function createEquipment(array $data, User $owner): Equipment
    {
        $equipment = ($this->createEquipmentAction)($data, $owner);
        $this->audit->log('equipment_created', $equipment);
        return $equipment;
    }

    public function updateEquipment(Equipment $equipment, array $data): Equipment
    {
        $equipment->update($data);
        $this->audit->log('equipment_updated', $equipment);
        return $equipment->refresh();
    }

    public function toggleVisibility(Equipment $equipment): Equipment
    {
        if ($equipment->status === EquipmentStatus::Deleted) {
            throw new \Exception('Deleted equipment cannot change visibility.');
        }

        $newStatus = $equipment->status === EquipmentStatus::Active
            ? EquipmentStatus::Hidden
            : EquipmentStatus::Active;

        ($this->updateStatus)($equipment, $newStatus);
        $this->audit->log('equipment_visibility_toggled', $equipment);
        return $equipment->refresh();
    }

    public function deleteEquipment(Equipment $equipment): void
    {
        ($this->updateStatus)($equipment, EquipmentStatus::Deleted);
        $this->audit->log('equipment_deleted', $equipment);
    }
}