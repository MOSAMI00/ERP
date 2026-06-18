<?php

namespace App\Domains\Rental\Actions;

use App\Models\RentalOperation;

class SignOwnerContractAction
{
    public function handle(RentalOperation $rental): void
    {
        $rental->contract->update([
            'owner_signature' => 'signed',
            'owner_signed_at' => now(),
            'status' => $rental->contract->tenant_signature === 'signed' ? 'signed' : 'pending',
        ]);
    }
}
