<?php

namespace App\Http\Controllers;

use App\Domains\Handover\Services\HandoverWorkflowService;
use App\Models\HandoverReport;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use App\Http\Requests\StoreHandoverReportRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Domains\Rental\Enums\RentalStatus;

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

        // Check if report already exists for this user and phase to handle duplicate requests
        $exists = $rental->handoverReports()
            ->where('phase', $data['phase'])
            ->where('submitted_by_id', $user->id)
            ->exists();

        if ($exists) {
            return back()->with('success', 'Handover report already submitted.');
        }

        $imageUrls = [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $imageUrls[] = $image->store('handover-images', 'public');
            }
        }

        try {
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
        } catch (\App\Domains\Shared\Exceptions\InvalidStateTransitionException $e) {
            // If the transaction has already been completed by a parallel request, treat as success
            $freshRental = $rental->fresh();
            $isReturnDone = $data['phase'] === 'return' && in_array($freshRental->status, [RentalStatus::ReturnDone, RentalStatus::Completed]);
            $isDeliveryDone = $data['phase'] === 'delivery' && in_array($freshRental->status, [RentalStatus::InUse, RentalStatus::ReturnDone, RentalStatus::Completed]);

            if ($isReturnDone || $isDeliveryDone) {
                return back()->with('success', 'Handover report submitted.');
            }

            return back()->withErrors(['error' => $e->getMessage()]);
        } catch (\App\Domains\Shared\Exceptions\DuplicateOperationException $e) {
            return back()->with('success', 'Handover report already submitted.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
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
