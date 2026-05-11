<?php

namespace App\Domains\User\Actions;

use App\Domains\User\Enums\UserStatus;
use App\Models\User;

class UpdateUserStatusAction
{
    public function __invoke(User $user, UserStatus $status): User
    {
        $user->update(['status' => $status]);

        return $user->refresh();
    }
}