<?php

namespace App\Domains\Compensation\Actions;

use App\Domains\Compensation\Enums\OwnerDecision;
use App\Models\EquipmentHandover;

class AutoSettleAfterDeadlineAction
{
    public function handle(
        EquipmentHandover $handover,
        OwnerDecision $decision,
    ): void {
        $handover->update([
            'owner_decision' => $decision,
            'decided_at'     => now(),
            // ✦ لا decidedBy — تسوية تلقائية بلا تدخل بشري
        ]);
    }
}
