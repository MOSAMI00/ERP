<?php
// app/Policies/ContractPolicy.php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    public function view(User $user, Contract $contract): bool
    {
        return $user->id === $contract->rental->tenant_id
            || $user->id === $contract->rental->owner_id;
    }

    public function sign(User $user, Contract $contract): bool
    {
        return $this->view($user, $contract)
            && $contract->status !== 'signed';
    }
}