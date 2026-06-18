<?php

namespace App\Shared\Audit;

use Illuminate\Database\Eloquent\Model;
use App\Models\AuditLog;

class AuditLogService
{
    public function log(string $event, Model $subject, ?Model $actor = null): void
    {
        if (!$actor instanceof \App\Models\Admin) {
            return;
        }

        AuditLog::create([
            'admin_id'    => $actor->getKey(),
            'admin_role'  => $actor->role?->role_name,
            'event_type'  => $event,
            'target_type' => $subject->getMorphClass(),
            'target_id'   => $subject->getKey(),
            'details'     => $this->extractMetadata($subject),
        ]);
    }

    private function extractMetadata(Model $subject): string
    {
        $metadata = \Illuminate\Support\Arr::except($subject->toArray(), [
            'password',
            'password_hash',
            'remember_token',
        ]);

        return json_encode($metadata, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
