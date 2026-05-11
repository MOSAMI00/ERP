<?php

namespace App\Domains\User\Actions;

use App\Models\UserPaymentMethod;
use App\Models\User;

class AddPaymentMethodAction
{
    public function __invoke(User $user, array $data): UserPaymentMethod
    {
        // إذا كانت هذه الطريقة الأولى، تصبح الافتراضية تلقائياً
        $isDefault = ! $user->paymentMethods()->exists();

        return $user->paymentMethods()->create([
            'type'       => $data['type'],
            'details'    => $data['details'],
            'is_default' => $isDefault,
        ]);
    }
}