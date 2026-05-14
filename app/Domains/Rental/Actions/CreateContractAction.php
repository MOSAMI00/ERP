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
            'tenant_signature' => 'signed',
            'tenant_signed_at' => now(),
            'owner_signature'  => 'pending',
            'status'           => 'pending',
        ]);
    }

    private function generateBody(RentalOperation $rental): string
    {
        $equipment = $rental->equipment;
        $tenant = $rental->tenant;
        $owner = $rental->owner;

        return "عقد تأجير معدة: {$equipment->name}\n" .
               "رقم العملية: #{$rental->id}\n" .
               "المؤجر: {$owner->full_name}\n" .
               "المستأجر: {$tenant->full_name}\n" .
               "فترة التأجير: من {$rental->start_date} إلى {$rental->end_date}\n" .
               "إجمالي المبلغ: {$rental->total_amount} ر.ي\n\n" .
               "يقر المستأجر بموافقته على كافة الشروط والأحكام الخاصة بالمنصة والمذكورة في تفاصيل المعدة.";
    }
}
