<?php

namespace App\Domains\Compensation\Actions;

use App\Domains\Compensation\Enums\OwnerDecision;
use App\Models\EquipmentHandover;
use App\Models\User;

class AcceptCompensationAction
{
    public function handle(
        EquipmentHandover $handover,
        OwnerDecision $decision,
        ?User $decidedBy = null,
    ): void {
        $handover->update([
            'owner_decision'         => $decision,
            'decided_by_id'          => $decidedBy?->id,
            'decided_at'             => now(),
            'objection_submitted_at' => now(),
        ]);
    }
}
