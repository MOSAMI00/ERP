<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dispute;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDisputeController extends Controller
{
    public function index(Request $request)
    {
        $disputes = Dispute::with(['rental.equipment', 'raisedBy'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Disputes/Index', [
            'disputes' => $disputes,
            'filters'  => $request->only('status'),
        ]);
    }

    public function show(Dispute $dispute)
    {
        return Inertia::render('Admin/Disputes/Show', [
            'dispute' => $dispute->load([
                'rental.equipment',
                'rental.tenant',
                'rental.owner',
                'raisedBy',
                'handover',
            ]),
        ]);
    }

    public function resolve(Request $request, Dispute $dispute)
    {
        $data = $request->validate([
            'admin_decision'     => ['required', 'in:accept_deduction,reject_deduction,modify_compensation'],
            'final_compensation' => ['nullable', 'numeric', 'min:0'],
            'admin_note'         => ['required', 'string'],
        ]);

        $dispute->update([
            ...$data,
            'status'          => 'resolved',
            'resolved_by_id'  => Auth::id(),
            'resolved_at'     => now(),
        ]);

        return back()->with('success', 'Dispute resolved.');
    }
}