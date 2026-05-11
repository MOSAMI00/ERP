<?php

namespace App\Http\Controllers;

use App\Domains\Dispute\Services\DisputeWorkflowService;
use App\Models\Dispute;
use App\Models\EquipmentHandover;
use Illuminate\Http\Request;
use App\Http\Requests\StoreDisputeRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DisputeController extends Controller
{
    public function __construct(
        private DisputeWorkflowService $workflow,
    ) {}

    public function index()
    {
        $disputes = Dispute::where('raised_by_id', Auth::id())
            ->with(['rental.equipment', 'handover'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Disputes/Index', [
            'disputes' => $disputes,
        ]);
    }

    public function create(EquipmentHandover $handover)
    {
        return Inertia::render('Disputes/Create', [
            'handover' => $handover->load(['rental.equipment', 'rental.owner']),
        ]);
    }

    public function store(StoreDisputeRequest $request)
    {
        $data = $request->validated();

        $handover = EquipmentHandover::with('rental')->findOrFail($data['equipment_handover_id']);
        abort_unless((int) $handover->rental_op_id === (int) $data['rental_op_id'], 422);

        $this->workflow->openDispute(
            $handover,
            $request->user(),
            $data['tenant_claim'],
            (float) ($data['requested_amount'] ?? 0),
        );

        return redirect()->route('disputes.index')
            ->with('success', 'Dispute opened.');
    }

    public function show(Dispute $dispute)
    {
        $this->authorize('view', $dispute);

        return Inertia::render('Disputes/Show', [
            'dispute' => $dispute->load([
                'rental.equipment',
                'raisedBy',
                'resolvedBy',
                'handover',
            ]),
        ]);
    }
}
