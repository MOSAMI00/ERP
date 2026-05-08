<?php
// app/Policies/EquipmentHandoverPolicy.php

namespace App\Policies;

use App\Models\EquipmentHandover;
use App\Models\User;

class EquipmentHandoverPolicy
{
    public function view(User $user, EquipmentHandover $handover): bool
    {
        return $user->id === $handover->rental->tenant_id
            || $user->id === $handover->rental->owner_id;
    }

    // فقط الـ owner يتخذ القرار النهائي
    public function update(User $user, EquipmentHandover $handover): bool
    {
        return $user->id === $handover->rental->owner_id
            && $handover->decided_at === null;
    }
}