<?php

namespace App\Domains\Compensation\Actions;

use App\Models\RentalOperation;

class CalculateLateFeeAction
{
    public function handle(RentalOperation $rental): float
    {
        // ✦ لا late fee إذا لم تنته مدة الإيجار بعد
        if (now()->lte($rental->end_date)) {
            return 0.0;
        }

        $lateDays = $rental->end_date
            ->startOfDay()
            ->diffInDays(now()->startOfDay());

        if ($lateDays === 0 || $rental->duration_days <= 0) {
            return 0.0;
        }

        // ✦ الخيار الثاني — أكثر أماناً — لا يعتمد على العلاقة
        // TODO: Define if late_fee is fixed per day or % of daily rate
        $dailyRate = $rental->rental_amount / $rental->duration_days;

        return round($lateDays * $dailyRate, 2);
    }
}
