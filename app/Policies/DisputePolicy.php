<?php
// app/Policies/DisputePolicy.php

namespace App\Policies;

use App\Models\Dispute;
use App\Models\User;

class DisputePolicy
{
    public function view(User $user, Dispute $dispute): bool
    {
        return $user->id === $dispute->raised_by_id
            || $user->id === $dispute->rental->owner_id;
    }
}