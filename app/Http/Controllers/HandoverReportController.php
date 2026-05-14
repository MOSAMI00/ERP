<?php

namespace App\Http\Controllers;

use App\Domains\Handover\Services\HandoverWorkflowService;
use App\Models\HandoverReport;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use App\Http\Requests\StoreHandoverReportRequest;
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

    public function store(StoreHandoverReportRequest $request)
    {
        $data = $request->validated();

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

        return back()->with('success', 'Handover report submitted.');
    }

    public function confirm(Request $request, HandoverReport $report)
    {
        $this->authorize('confirm', $report);

        $this->workflow->confirmReport($report, Auth::user());

        return back()->with('success', 'Report confirmed.');
    }
}
