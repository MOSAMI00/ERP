<?php

namespace App\Domains\Compensation\Actions;

use App\Models\EquipmentHandover;



class RequestCompensationAction
{
    public function handle(
        EquipmentHandover $handover,
        float $proposedDeduction,
        string $notes,
        int $windowHours,
    ): void {
        $handover->update([
            'proposed_deduction'     => $proposedDeduction,
            'final_notes'            => $notes,
            'objection_deadline'     => now()->addHours($windowHours),
            'objection_submitted_at' => null,
        ]);
    }
}
