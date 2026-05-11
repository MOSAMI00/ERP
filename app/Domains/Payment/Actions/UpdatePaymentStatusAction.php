<?php

namespace App\Domains\Payment\Actions;

use App\Domains\Payment\Enums\PaymentStatus;
use App\Models\Payment;

class UpdatePaymentStatusAction
{
    public function handle(Payment $payment, PaymentStatus $status): void
    {
        $payload = ['status' => $status];

        if ($status === PaymentStatus::Paid) {
            $payload['paid_at'] = now();
        }

        // ✦ refund != transfer — حقلان منفصلان
        if ($status === PaymentStatus::Refunded) {
            $payload['refunded_at'] = now();
        }

        if ($status === PaymentStatus::Cancelled) {
            $payload['cancelled_at'] = now();
        }

        $payment->update($payload);
    }
}
