<?php

namespace App\Http\Controllers;

use App\Domains\Handover\Services\HandoverWorkflowService;
use App\Models\HandoverReport;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HandoverReportController extends Controller
{
    public function __construct(
        private HandoverWorkflowService $workflow,
    ) {}

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
        $rental = RentalOperation::findOrFail($data['rental_op_id']);
        $this->authorize('view', $rental);

        $imageUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageUrls[] = $image->store('handover-images', 'public');
            }
        }

        if ($data['phase'] === 'delivery' && (int) $user->id === (int) $rental->owner_id) {
            $this->workflow->submitOwnerDeliveryReport($rental, $user, $data, $imageUrls);
        } elseif ($data['phase'] === 'delivery' && (int) $user->id === (int) $rental->tenant_id) {
            $this->workflow->submitTenantDeliveryReport($rental, $user, $data, $imageUrls);
        } elseif ($data['phase'] === 'return' && (int) $user->id === (int) $rental->tenant_id) {
            $this->workflow->submitTenantReturnReport($rental, $user, $data, $imageUrls);
        } elseif ($data['phase'] === 'return' && (int) $user->id === (int) $rental->owner_id) {
            $this->workflow->submitOwnerReturnReport($rental, $user, $data, $imageUrls);
        } else {
            abort(403);
        }

        return redirect()->route('rentals.show', $data['rental_op_id'])
            ->with('success', 'Handover report submitted.');
    }

    public function confirm(Request $request, HandoverReport $report)
    {
        $this->authorize('confirm', $report);

        $user = Auth::user();

        $report->update([
            'confirmed_by_id'   => $user->id,
            'confirmed_by_role' => $user->type,
            'confirmed_at'      => now(),
        ]);

        return back()->with('success', 'Report confirmed.');
    }
}
