<?php
// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\User\Enums\KycStatus;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'          => $request->user()->id,
                    'full_name'   => $request->user()->full_name,
                    'email'       => $request->user()->email,
                    'phone'       => $request->user()->phone,
                    'type'        => $request->user()->type,
                    'status'      => $request->user()->status?->value,
                    'kyc_status'  => $request->user()->kyc_status,
                    'avatar'      => $request->user()->avatar,
                    'rating'      => $request->user()->rating,
                    'governorate' => $request->user()->governorate,
                ] : null,
                'admin' => $request->user('admin') ? [
                    'id'    => $request->user('admin')->id,
                    'name'  => $request->user('admin')->name,
                    'email' => $request->user('admin')->email,
                    'role'  => $request->user('admin')->role?->role_name ?? 'Admin',
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
            ],
            'notifications_count' => $request->user()
                ? \App\Models\Notification::where('recipient_id', $request->user()->id)
                    ->where('recipient_type', 'user')
                    ->where('is_read', false)
                    ->count()
                : 0,
            'unread_notifications_count' => $request->user()
                ? \App\Models\Notification::where('recipient_id', $request->user()->id)
                    ->where('recipient_type', 'user')
                    ->where('is_read', false)
                    ->count()
                : 0,
            'sharedData' => [
                'governorates' => config('locations.governorates', []),
                'statuses' => [
                    'rental' => $this->serializeEnum(RentalStatus::cases(), [
                        'pending' => ['label' => 'قيد المراجعة', 'tone' => 'warning'],
                        'confirmed' => ['label' => 'بانتظار الدفع', 'tone' => 'info'],
                        'paid' => ['label' => 'مدفوع', 'tone' => 'success'],
                        'in_use' => ['label' => 'قيد الاستخدام', 'tone' => 'primary'],
                        'return_done' => ['label' => 'تم الإرجاع', 'tone' => 'info'],
                        'compensation_requested' => ['label' => 'تعويض مطلوب', 'tone' => 'warning'],
                        'completed' => ['label' => 'مكتمل', 'tone' => 'success'],
                        'cancelled' => ['label' => 'ملغي', 'tone' => 'danger'],
                        'disputed' => ['label' => 'نزاع', 'tone' => 'danger'],
                    ]),
                    'payment' => $this->serializeEnum(PaymentStatus::cases(), [
                        'pending' => ['label' => 'قيد الانتظار', 'tone' => 'warning'],
                        'processing' => ['label' => 'قيد المعالجة', 'tone' => 'info'],
                        'paid' => ['label' => 'مدفوع', 'tone' => 'success'],
                        'failed' => ['label' => 'فشل', 'tone' => 'danger'],
                        'cancelled' => ['label' => 'ملغي', 'tone' => 'danger'],
                        'stopped' => ['label' => 'متوقف', 'tone' => 'neutral'],
                        'refunded' => ['label' => 'مسترد', 'tone' => 'neutral'],
                    ]),
                    'equipment' => $this->serializeEnum(EquipmentStatus::cases(), [
                        'active' => ['label' => 'نشط', 'tone' => 'success'],
                        'hidden' => ['label' => 'مخفي', 'tone' => 'warning'],
                        'deleted' => ['label' => 'محذوف', 'tone' => 'danger'],
                    ]),
                    'kyc' => $this->serializeEnum(KycStatus::cases(), [
                        'pending' => ['label' => 'قيد المراجعة', 'tone' => 'warning'],
                        'approved' => ['label' => 'موثق', 'tone' => 'success'],
                        'rejected' => ['label' => 'مرفوض', 'tone' => 'danger'],
                    ]),
                ],
            ],
        ]);
    }

    private function serializeEnum(array $cases, array $meta = []): array
    {
        return array_map(fn ($case) => [
            'name' => $case->name,
            'value' => $case->value,
            'label' => $meta[$case->value]['label'] ?? str($case->name)->headline()->toString(),
            'tone' => $meta[$case->value]['tone'] ?? 'neutral',
        ], $cases);
    }
}
