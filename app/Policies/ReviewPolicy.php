<?php
// app/Policies/ReviewPolicy.php

namespace App\Policies;

use App\Models\Review;
use App\Models\RentalOperation;
use App\Models\User;

class ReviewPolicy
{
    // يقدر يكتب review فقط من أكمل الإيجار
    public function create(User $user, RentalOperation $rental): bool
    {
        return ($user->id === $rental->tenant_id || $user->id === $rental->owner_id)
            && $rental->status === 'completed'
            && !Review::where('reviewer_id', $user->id)
                ->where('rental_op_id', $rental->id)
                ->exists();
    }
}