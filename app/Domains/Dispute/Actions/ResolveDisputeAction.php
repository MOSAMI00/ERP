<?php

namespace App\Domains\Dispute\Actions;

use App\Domains\Dispute\Enums\AdminDecision;
use App\Domains\Dispute\Enums\DisputeStatus;
use App\Models\Admin;
use App\Models\Dispute;

class ResolveDisputeAction
{
    public function handle(
        Dispute $dispute,
        Admin $resolvedBy,
        AdminDecision $decision,
        float $compensation,
        string $note,
    ): void {
        $dispute->update([
            'status'             => DisputeStatus::Resolved->value,
            'admin_decision'     => $decision->value,
            'final_compensation' => $compensation,
            'admin_note'         => $note,
            'resolved_by_id'     => $resolvedBy->id,
            'resolved_at'        => now(),
        ]);
    }

    public function updateStatus(Dispute $dispute, DisputeStatus $status): void
    {
        $dispute->update(['status' => $status->value]);
    }
}
