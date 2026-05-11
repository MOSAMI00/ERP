<?php

namespace App\Http\Controllers;

use App\Domains\Compensation\Enums\OwnerDecision;
use App\Domains\Compensation\Services\CompensationWorkflowService;
use App\Models\EquipmentHandover;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
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
            'final_condition' => $data['final_condition'],
            'final_notes' => $data['final_notes'] ?? null,
        ]);

        if ($data['owner_decision'] === OwnerDecision::FullRefund->value) {
            $this->workflow->skipCompensation($handover);
        } else {
            $deduction = $data['owner_decision'] === OwnerDecision::NoRefund->value
                ? (float) $handover->rental->insurance_amount
                : (float) ($data['proposed_deduction'] ?? 0);

            $this->workflow->requestCompensation(
                $handover,
                $deduction,
                $data['final_notes'] ?? '',
            );
        }

        return back()->with('success', 'Decision submitted.');
    }
}
