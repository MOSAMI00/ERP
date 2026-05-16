<?php

namespace App\Domains\User\Services;

use App\Domains\User\Actions\UpdateUserStatusAction;
use App\Domains\User\Enums\UserStatus;
use App\Domains\Shared\Exceptions\InvalidStateTransitionException;
use App\Shared\Audit\AuditLogService;
use App\Models\Admin;
use App\Models\User;

class UserStatusService
{
    public function __construct(
        private UpdateUserStatusAction $updateStatus,
        private AuditLogService        $audit,
    ) {}

    public function suspend(User $user, Admin $admin): User
    {
        if ($user->status === UserStatus::Banned) {
            throw InvalidStateTransitionException::expected('non-banned', 'banned');
        }

        ($this->updateStatus)($user, UserStatus::Suspended);

        $this->audit->log('user_suspended', $user, $admin);

        return $user->refresh();
    }

    public function ban(User $user, Admin $admin, ?string $reason = null): User
    {
        ($this->updateStatus)($user, UserStatus::Banned);
        $user->update(['ban_reason' => $reason]);

        $this->audit->log('user_banned', $user, $admin);

        return $user->refresh();
    }

    public function activate(User $user, Admin $admin): User
    {
        if ($user->status === UserStatus::Active) {
            throw InvalidStateTransitionException::expected('non-active', 'active');
        }

        ($this->updateStatus)($user, UserStatus::Active);
        $user->update(['ban_reason' => null]);

        $this->audit->log('user_activated', $user, $admin);

        return $user->refresh();
    }
}
