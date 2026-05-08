<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::with('admin')
            ->when($request->event_type, fn($q) => $q->where('event_type', $request->event_type))
            ->latest()
            ->paginate(30);

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs'    => $logs,
            'filters' => $request->only('event_type'),
        ]);
    }
}