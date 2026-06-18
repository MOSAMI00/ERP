<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PlatformSetting;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PlatformSettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Index', [
            'settings' => PlatformSetting::firstOrCreate([]),
        ]);
    }

    public function update(UpdateSettingsRequest $request)
    {
        $data = $request->validated();

        PlatformSetting::firstOrCreate([])->update([
            ...$data,
            'updated_by' => Auth::guard('admin')->id() ?? Auth::id(),
        ]);

        Cache::forget('platform_settings');

        return back()->with('success', 'Settings updated.');
    }
}
