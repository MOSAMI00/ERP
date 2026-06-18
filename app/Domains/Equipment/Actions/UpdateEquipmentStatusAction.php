<?php

namespace App\Domains\Equipment\Actions;

use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Models\Equipment;

class UpdateEquipmentStatusAction
{
    public function __invoke(Equipment $equipment, EquipmentStatus $status): Equipment
    {
        $equipment->update(['status' => $status]);
        return $equipment->refresh();
    }
}