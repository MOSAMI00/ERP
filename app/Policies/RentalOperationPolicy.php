<?php
// app/Policies/RentalOperationPolicy.php

namespace App\Policies;

use App\Models\RentalOperation;
use App\Models\User;

class RentalOperationPolicy
{
    // tenant و owner كلاهما يشوفون الإيجار
    public function view(User $user, RentalOperation $rental): bool
    {
        return $user->id === $rental->tenant_id
            || $user->id === $rental->owner_id;
    }

    // فقط الـ owner يقدر يقبل أو يلغي من طرفه
    public function update(User $user, RentalOperation $rental): bool
    {
        return $user->id === $rental->owner_id
            || $user->id === $rental->tenant_id;
    }

    // فقط الـ owner يقبل الطلب
    public function confirm(User $user, RentalOperation $rental): bool
    {
        return $user->id === $rental->owner_id
            && $rental->status === 'pending';
    }

    // أي من الطرفين يقدر يلغي
    public function cancel(User $user, RentalOperation $rental): bool
    {
        return ($user->id === $rental->owner_id || $user->id === $rental->tenant_id)
            && in_array($rental->status, ['pending', 'confirmed']);
    }
}