<?php

namespace App\Shared\Settings;

use App\Models\PlatformSetting;
use App\Models\RentalOperation;
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

    public function getPlatformTerms(): string
    {
        return (string) $this->get('platform_terms', $this->defaultPlatformTerms());
    }

    public function getContractTemplate(): string
    {
        $contractFile = base_path('contract.md');

        if (is_file($contractFile)) {
            return (string) file_get_contents($contractFile);
        }

        return (string) $this->get('contract_template', $this->defaultContractTemplate());
    }

    public function renderContractForRental(RentalOperation $rental): string
    {
        $rental->loadMissing(['equipment', 'tenant', 'owner']);

        return $this->renderContractTemplate([
            'rental_id' => $rental->id,
            'issued_at' => now()->format('Y-m-d'),
            'tenant_name' => $rental->tenant?->full_name,
            'owner_name' => $rental->owner?->full_name,
            'equipment_name' => $rental->equipment?->name,
            'rental_price' => number_format((float) $rental->rental_amount, 2),
            'insurance_amount' => number_format((float) $rental->insurance_amount, 2),
            'total_amount' => number_format((float) $rental->total_amount, 2),
            'start_date' => $this->formatDateValue($rental->start_date),
            'end_date' => $this->formatDateValue($rental->end_date),
            'delivery_location' => $rental->delivery_location,
            'preferred_time_slot' => $rental->delivery_time ?: $rental->preferred_time_slot,
        ]);
    }

    public function renderContractTemplate(array $variables): string
    {
        $aliases = [
            'rental_id' => 'رقم_العملية',
            'issued_at' => 'تاريخ_الإصدار',
            'tenant_name' => 'اسم_المستأجر',
            'owner_name' => 'اسم_المؤجر',
            'equipment_name' => 'اسم_المعدة',
            'rental_price' => 'إجمالي_الإيجار',
            'insurance_amount' => 'مبلغ_التأمين',
            'start_date' => 'تاريخ_البداية',
            'end_date' => 'تاريخ_النهاية',
        ];

        $replacements = [];
        foreach ($variables as $key => $value) {
            $value = (string) ($value ?? '—');
            $replacements['{' . $key . '}'] = $value;
            $replacements['{{' . $key . '}}'] = $value;

            if (isset($aliases[$key])) {
                $replacements['{{' . $aliases[$key] . '}}'] = $value;
            }
        }

        return strtr($this->getContractTemplate(), $replacements);
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

    private function defaultPlatformTerms(): string
    {
        return implode("\n", [
            'يجب على جميع المستخدمين (مؤجرين ومستأجرين) إكمال عملية توثيق الهوية (KYC) قبل إجراء أي عملية مالية أو طلب معدة.',
            'يتم تحصيل مبلغ إيجار المعدة بالإضافة إلى مبلغ التأمين كاملاً عبر المنصة قبل تأكيد الاستلام.',
            'يبقى مبلغ التأمين معلقاً كضمان، ويتم إرجاعه للمستأجر بعد إرجاع المعدة سليمة واعتماد ذلك من قبل المؤجر.',
            'في حال وجود تلفيات، يحق للمؤجر المطالبة باقتطاع جزء أو كل مبلغ التأمين للتعويض.',
            'يلتزم المؤجر بتسليم المعدة بحالة تشغيلية جيدة ومطابقة للوصف والصور المعروضة.',
            'يلتزم المستأجر بالاستخدام العادل للمعدة وإرجاعها في الوقت المحدد بنفس الحالة التي استلمها بها.',
            'يجب على الطرفين توثيق حالة المعدة (بالصور والملاحظات) أثناء التسليم وأثناء الإرجاع عبر النظام.',
            'في حال نشوب خلاف حول حالة المعدة بعد الإرجاع، يمكن لأي من الطرفين رفع "نزاع" لتدخل الإدارة.',
            'إلغاء الطلب المكتمل قبل الاستلام قد يخضع لرسوم إدارية.',
            'التأخير في إرجاع المعدة عن الوقت المحدد في العقد قد يؤدي لفرض غرامات تأخير تُخصم من التأمين.',
        ]);
    }

    private function formatDateValue(mixed $value): string
    {
        return $value instanceof \DateTimeInterface ? $value->format('Y-m-d') : (string) ($value ?? '—');
    }

    private function defaultContractTemplate(): string
    {
        return implode("\n", [
            'عقد تأجير معدة إلكتروني',
            'المؤجر: {owner_name}',
            'المستأجر: {tenant_name}',
            'المعدة: {equipment_name}',
            'فترة التأجير: من {start_date} إلى {end_date}',
            'موقع التسليم: {delivery_location}',
            'الوقت المفضل للاستلام: {preferred_time_slot}',
            'قيمة الإيجار: {rental_price} ر.ي',
            'مبلغ التأمين: {insurance_amount} ر.ي',
            'الإجمالي: {total_amount} ر.ي',
            '',
            'يقر الطرفان بأن هذا العقد الإلكتروني ملزم، وأن بيانات التسليم والاستلام والتقارير المصورة جزء من سجل العملية الرسمي في المنصة.',
        ]);
    }
}
