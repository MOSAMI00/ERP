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
            'type'           => $data['type'],
            'account_name'   => $data['account_name'] ?? null,
            'account_number' => $data['account_number'] ?? null,
            'bank_name'      => $data['bank_name'] ?? null,
            'wallet_number'  => $data['wallet_number'] ?? null,
            'token_ref'      => $data['token_ref'] ?? null,
            'is_default'     => $isDefault || ! empty($data['is_default']),
        ]);
    }
}
