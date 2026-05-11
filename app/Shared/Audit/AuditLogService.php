<?php

namespace App\Shared\Audit;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use App\Models\AuditLog;

class AuditLogService
{
    public function log(string $event, Model $subject, ?Model $actor = null): void
    {
        AuditLog::create([
            'event'        => $event,
            'subject_type' => $subject->getMorphClass(),
            'subject_id'   => $subject->getKey(),
            'actor_type'   => $actor?->getMorphClass(),
            'actor_id'     => $actor?->getKey(),
            'metadata'     => $this->extractMetadata($subject),
        ]);
    }

    private function extractMetadata(Model $subject): array
    {
        return Arr::except($subject->toArray(), [
            'password',
            'remember_token',
        ]);
    }
}