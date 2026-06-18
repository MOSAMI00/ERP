<?php

namespace App\Domains\Payment\Services;

use App\Models\Payment;
use Exception;

class EscrowService
{
    /**
     * التخاطب مع بوابة الدفع لحجز المبلغ.
     * ✦ لا تلمس قاعدة البيانات — هذا دور الـ Action.
     */
    public function holdFunds(Payment $payment, array $gatewayData): bool
    {
        // TODO: Integrate with actual Payment Gateway API (e.g., Stripe, Moyasar)
        return true;
    }

    public function releaseToOwner(Payment $payment, float $amount): bool
    {
        // TODO: Integrate with Gateway Payout API
        if ($amount <= 0) {
            throw new Exception('Release amount must be > 0.');
        }

        return true;
    }

    public function refundToTenant(Payment $payment, float $amount): bool
    {
        // TODO: Integrate with Gateway Refund API
        if ($amount <= 0) {
            throw new Exception('Refund amount must be > 0.');
        }

        return true;
    }
}
