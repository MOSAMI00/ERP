<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlatformSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => PlatformSetting::first(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'platform_fee_rate'      => ['required', 'numeric', 'min:0', 'max:100'],
            'min_rental_days'        => ['required', 'integer', 'min:1'],
            'max_rental_days'        => ['required', 'integer', 'min:1'],
            'objection_window_hours' => ['required', 'integer', 'min:1'],
            'refund_window_days'     => ['required', 'integer', 'min:1'],
            'kyc_required'           => ['required', 'boolean'],
        ]);

        PlatformSetting::first()->update([
            ...$data,
            'updated_by' => Auth::id(),
        ]);

        return back()->with('success', 'Settings updated.');
    }
}