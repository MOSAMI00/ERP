<?php

namespace App\Shared\Settings;

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
        // يُعاد 0.05 ليُضرب مباشرة في المبلغ (5%)
        return (float) $this->get('platform_fee_rate', 0.05);
    }

    public function getMaxRentalDays(): int
    {
        return (int) $this->get('max_rental_days', 30);
    }

    private function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember(
            "platform_settings_{$key}",
            self::CACHE_TTL,
            fn () => \App\Models\PlatformSetting::where('key', $key)->value('value') ?? $default,
        );
    }
}