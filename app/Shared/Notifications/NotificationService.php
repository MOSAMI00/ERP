<?php

namespace App\Shared\Notifications;

use App\Models\RentalOperation;
use App\Models\User;
use App\Models\Admin;
use App\Models\Notification;

class NotificationService
{
    public function notifyTenant(RentalOperation $rental, string $event): void
    {
        $this->create('user', $rental->tenant_id, $event, 'rental', $rental->id);
    }

    public function notifyOwner(RentalOperation $rental, string $event): void
    {
        $this->create('user', $rental->owner_id, $event, 'rental', $rental->id);
    }

    public function notifyBoth(RentalOperation $rental, string $event): void
    {
        $this->notifyTenant($rental, $event);
        $this->notifyOwner($rental, $event);
    }

    public function notifyUser(User $user, string $event): void
    {
        $this->create('user', $user->id, $event, 'user', $user->id);
    }

    public function notifyAdmins(string $event): void
    {
        Admin::query()
            ->where('status', 'active')
            ->each(fn (Admin $admin) => $this->create('admin', $admin->id, $event));
    }

    private function create(
        string $recipientType,
        int $recipientId,
        string $event,
        ?string $referenceType = null,
        ?int $referenceId = null,
    ): void {
        Notification::create([
            'recipient_type' => $recipientType,
            'recipient_id' => $recipientId,
            'type' => $event,
            'title' => str_replace('_', ' ', $event),
            'body' => str_replace('_', ' ', $event),
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'priority' => 'medium',
        ]);
    }
}
