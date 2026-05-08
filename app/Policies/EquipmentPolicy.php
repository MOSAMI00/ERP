<?php
// app/Policies/EquipmentPolicy.php

namespace App\Policies;

use App\Models\Equipment;
use App\Models\User;

class EquipmentPolicy
{
    public function update(User $user, Equipment $equipment): bool
    {
        return $user->id === $equipment->owner_id;
    }

    public function delete(User $user, Equipment $equipment): bool
    {
        return $user->id === $equipment->owner_id;
    }
}