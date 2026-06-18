<?php

namespace App\Domains\Payment\Services;

use App\Models\Payment;
use App\Models\RentalOperation;

class RefundService
{
    public function calculateFullRefund(Payment $payment): float
    {
        return (float) $payment->amount;
    }

    public function calculatePartialRefund(
        Payment $payment,
        float   $deductionAmount,
    ): float {
        return max(0, $payment->amount - $deductionAmount);
    }

    public function calculateInsuranceRefund(
        RentalOperation $rental,
        float           $deductionAmount = 0,
    ): float {
        return max(0, $rental->insurance_amount - $deductionAmount);
    }

    public function calculateCancellationRefund(Payment $payment): float
    {
        // TODO: منطق رسوم الإلغاء لاحقاً (مثلاً خصم 10% عند الإلغاء المتأخر)
        return (float) $payment->amount;
    }
}
