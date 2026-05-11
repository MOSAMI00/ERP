<?php

namespace App\Shared\Audit;

use Illuminate\Database\Eloquent\Model;
use App\Models\AuditLog;

class AuditLogService
{
    public function log(string $event, Model $subject, ?Model $actor = null): void
    {
        AuditLog::create([
            'admin_id'    => $actor instanceof \App\Models\Admin ? $actor->getKey() : null,
            'admin_role'  => $actor instanceof \App\Models\Admin ? $actor->role?->role_name : null,
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
