<?php
// app/Policies/PaymentPolicy.php

namespace App\Policies;

use App\Domains\Payment\Enums\PaymentStatus;
use App\Models\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function view(User $user, Payment $payment): bool
    {
        return $user->id === $payment->payer_id
            || $user->id === $payment->rental->tenant_id
            || $user->id === $payment->rental->owner_id;
    }

    public function confirm(User $user, Payment $payment): bool
    {
        return $user->id === $payment->payer_id
            && $payment->status === PaymentStatus::Pending;
    }
}
