<?php

namespace App\Http\Controllers;

use App\Domains\Compensation\Enums\OwnerDecision;
use App\Domains\Compensation\Services\CompensationWorkflowService;
use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use App\Http\Requests\DecideHandoverRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EquipmentHandoverController extends Controller
{
    public function __construct(
        private CompensationWorkflowService $workflow,
    ) {}

    public function show(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        $handover = $rental->equipmentHandover()->with(['decidedBy', 'dispute'])->first();

        return Inertia::render('Handover/Show', [
            'rental'   => $rental->load(['equipment', 'tenant', 'owner']),
            'handover' => $handover,
        ]);
    }

    public function decide(DecideHandoverRequest $request, EquipmentHandover $handover)
    {
        $this->authorize('update', $handover);

        $data = $request->validated();

        $handover->update([
            'final_condition' => $data['final_condition'],
            'final_notes' => $data['final_notes'] ?? null,
        ]);

        if ($data['owner_decision'] === OwnerDecision::FullRefund->value) {
            $this->workflow->skipCompensation($handover);
        } else {
            $deduction = (float) ($data['proposed_deduction'] ?? 0);

            $this->workflow->requestCompensation(
                $handover,
                $deduction,
                $data['final_notes'] ?? '',
            );
        }

        return back()->with('success', 'Decision submitted.');
    }
    public function respond(Request $request, EquipmentHandover $handover)
    {
        $decision = $request->input('decision');

        if ($decision === 'accepted') {
            $this->workflow->acceptCompensation($handover);
            return back()->with('success', 'Compensation accepted.');
        }

        return back()->with('info', 'Action recorded.');
    }
}
