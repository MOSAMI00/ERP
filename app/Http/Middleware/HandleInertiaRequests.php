<?php
// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

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
        ]);
    }
}
