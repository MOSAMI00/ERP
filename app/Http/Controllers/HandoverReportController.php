<?php

namespace App\Http\Controllers;

use App\Models\HandoverReport;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HandoverReportController extends Controller
{
    public function create(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        return Inertia::render('Handover/Create', [
            'rental' => $rental->load(['equipment', 'tenant', 'owner']),
            'phase'  => request('phase', 'delivery'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'rental_op_id'     => ['required', 'exists:rental_operations,id'],
            'phase'            => ['required', 'in:delivery,return'],
            'notes'            => ['nullable', 'string'],
            'has_issues'       => ['required', 'boolean'],
            'condition_status' => ['required', 'in:good,damaged,partially_damaged'],
            'images'           => ['nullable', 'array'],
            'images.*'         => ['image', 'max:4096'],
        ]);

        $user = Auth::user();

        $report = HandoverReport::create([
            'rental_op_id'     => $data['rental_op_id'],
            'phase'            => $data['phase'],
            'submitted_by_id'  => $user->id,
            'submitted_by_role'=> $user->type,
            'notes'            => $data['notes'] ?? null,
            'has_issues'       => $data['has_issues'],
            'condition_status' => $data['condition_status'],
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $url = $image->store('handover-images', 'public');
                $report->images()->create([
                    'image_url'  => $url,
                    'sort_order' => $index,
                ]);
            }
        }

        return redirect()->route('rentals.show', $data['rental_op_id'])
            ->with('success', 'Handover report submitted.');
    }

    public function confirm(Request $request, HandoverReport $report)
    {
        $user = Auth::user();

        $report->update([
            'confirmed_by_id'   => $user->id,
            'confirmed_by_role' => $user->type,
            'confirmed_at'      => now(),
        ]);

        return back()->with('success', 'Report confirmed.');
    }
}