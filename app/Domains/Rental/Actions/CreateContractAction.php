<?php

namespace App\Domains\Rental\Actions;

use App\Models\Contract;
use App\Models\RentalOperation;
use App\Shared\Settings\PlatformSettingsService;

class CreateContractAction
{
    public function __construct(
        private PlatformSettingsService $settings,
    ) {}

    public function handle(RentalOperation $rental): Contract
    {
        return Contract::create([
            'rental_op_id'     => $rental->id,
            'contract_body'    => $this->settings->renderContractForRental($rental),
            'tenant_signature' => 'signed',
            'tenant_signed_at' => now(),
            'owner_signature'  => 'pending',
            'status'           => 'pending',
        ]);
    }
}
