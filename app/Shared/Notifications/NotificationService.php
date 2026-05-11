<?php

namespace App\Shared\Notifications;

use App\Models\RentalOperation;
use App\Models\User;
use App\Models\Admin;
// use App\Notifications\DynamicNotification; // ✦ ستنشئه لاحقاً

class NotificationService
{
    public function notifyTenant(RentalOperation $rental, string $event): void
    {
        // $rental->tenant->notify(new DynamicNotification($event, $rental));
    }

    public function notifyOwner(RentalOperation $rental, string $event): void
    {
        // $rental->owner->notify(new DynamicNotification($event, $rental));
    }

    public function notifyBoth(RentalOperation $rental, string $event): void
    {
        $this->notifyTenant($rental, $event);
        $this->notifyOwner($rental, $event);
    }

    public function notifyUser(User $user, string $event): void
    {
        // $user->notify(new DynamicNotification($event));
    }

    public function notifyAdmins(string $event): void
    {
        // $admins = Admin::all();
        // Notification::send($admins, new DynamicNotification($event));
    }
}