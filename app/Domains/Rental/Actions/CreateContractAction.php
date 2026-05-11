<?php

namespace App\Domains\Rental\Actions;

use App\Models\Contract;
use App\Models\RentalOperation;

class CreateContractAction
{
    public function handle(RentalOperation $rental): Contract
    {
        return Contract::create([
            'rental_op_id'     => $rental->id,
            'contract_body'    => $this->generateBody($rental),
            'tenant_signature' => 'pending',
            'owner_signature'  => 'pending',
            'status'           => 'pending',
        ]);
    }

    private function generateBody(RentalOperation $rental): string
    {
        // TODO: استبدل بـ ContractTemplateService لاحقاً
        return "Contract for rental #{$rental->id}";
    }
}
