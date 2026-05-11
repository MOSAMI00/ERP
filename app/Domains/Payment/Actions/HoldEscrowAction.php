<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Models\Payment;

// ✦ يُستخدم لاحقاً عند ربط بوابة دفع خارجية تحتاج تأكيد Hold صريح
// حالياً CreatePaymentAction يضع Held مباشرة
class HoldEscrowAction
{
    public function handle(Payment $payment): void
    {
        $payment->update([
            'escrow_status' => EscrowStatus::Held,
        ]);
    }
}