<?php
// app/Policies/PaymentPolicy.php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->id === $payment->payer_id
            || $user->id === $payment->rental->owner_id;
    }

    public function confirm(User $user, Payment $payment): bool
    {
        // فقط الـ owner يؤكد استلام الدفع
        return $user->id === $payment->rental->owner_id
            && $payment->status === 'pending';
    }
}