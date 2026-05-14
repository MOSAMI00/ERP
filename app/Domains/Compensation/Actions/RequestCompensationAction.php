<?php

namespace App\Domains\Compensation\Actions;

use App\Models\EquipmentHandover;



class RequestCompensationAction
{
    public function handle(
        EquipmentHandover $handover,
        \App\Domains\Compensation\Enums\OwnerDecision $decision,
        float $proposedDeduction,
        string $notes,
        int $windowHours,
    ): void {
        $handover->update([
            'owner_decision'         => $decision,
            'proposed_deduction'     => $proposedDeduction,
            'final_notes'            => $notes,
            'decided_at'             => now(),
            'objection_deadline'     => now()->addHours($windowHours),
            'objection_submitted_at' => null,
        ]);
    }
}
