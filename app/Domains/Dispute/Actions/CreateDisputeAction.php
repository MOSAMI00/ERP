<?php

namespace App\Domains\Dispute\Actions;

use App\Domains\Dispute\Enums\DisputeStatus;
use App\Models\Dispute;
use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use App\Models\User;

class CreateDisputeAction
{
    public function handle(
        RentalOperation $rental,
        EquipmentHandover $handover,
        User $raisedBy,
        string $tenantClaim,
        float $requestedAmount,
    ): Dispute {
        return Dispute::create([
            'rental_op_id'           => $rental->id,
            'equipment_handover_id'  => $handover->id,
            'raised_by_id'           => $raisedBy->id,
            'tenant_claim'           => $tenantClaim,
            'requested_amount'       => $requestedAmount,
            'status'                 => DisputeStatus::Open->value,
        ]);
    }
}
