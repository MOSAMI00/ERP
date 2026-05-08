<?php

namespace App\Http\Controllers;

use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EquipmentHandoverController extends Controller
{
    public function show(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        $handover = $rental->finalHandover()->with(['decidedBy', 'dispute'])->first();

        return Inertia::render('Handover/Show', [
            'rental'   => $rental->load(['equipment', 'tenant', 'owner']),
            'handover' => $handover,
        ]);
    }

    public function decide(Request $request, EquipmentHandover $handover)
    {
        $this->authorize('update', $handover);

        $data = $request->validate([
            'owner_decision'     => ['required', 'in:full_refund,partial_refund,no_refund'],
            'proposed_deduction' => ['nullable', 'numeric', 'min:0'],
            'final_condition'    => ['required', 'in:good,damaged,partially_damaged'],
            'final_notes'        => ['nullable', 'string'],
        ]);

        $handover->update([
            ...$data,
            'decided_by_id' => Auth::id(),
            'decided_at'    => now(),
            'objection_deadline' => now()->addHours(
                config('platform.objection_window_hours', 24)
            ),
        ]);

        return back()->with('success', 'Decision submitted.');
    }
}