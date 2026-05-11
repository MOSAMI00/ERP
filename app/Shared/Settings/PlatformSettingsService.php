<?php

namespace App\Shared\Settings;

use App\Models\PlatformSetting;
use Illuminate\Support\Facades\Cache;

class PlatformSettingsService
{
    private const CACHE_TTL = 3600;

    public function getPaymentDeadlineHours(): int
    {
        return (int) $this->get('payment_deadline_hours', 24);
    }

    public function getObjectionWindowHours(): int
    {
        return (int) $this->get('objection_window_hours', 48);
    }

    public function getPlatformFeeRate(): float
    {
        $rate = (float) $this->get('platform_fee_rate', 0.05);

        return $rate > 1 ? $rate / 100 : $rate;
    }

    public function getMaxRentalDays(): int
    {
        return (int) $this->get('max_rental_days', 30);
    }

    private function get(string $key, mixed $default = null): mixed
    {
        $settings = Cache::remember(
            'platform_settings',
            self::CACHE_TTL,
            fn () => PlatformSetting::query()->first(),
        );

        return $settings?->{$key} ?? $default;
    }
}
