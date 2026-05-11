<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;    

class ContractController extends Controller
{
    public function show(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        $contract = $rental->contract;

        if (!$contract) {
            abort(404, 'No contract found for this rental.');
        }

        return Inertia::render('Contracts/Show', [
            'rental'   => $rental->load(['equipment', 'tenant', 'owner']),
            'contract' => $contract,
        ]);
    }

    public function tenantSign(Request $request, Contract $contract)
    {
        $this->authorize('view', $contract->rental);

        $data = $request->validate([
            'tenant_signature' => ['required', 'string'],
        ]);

        abort_unless((int) Auth::id() === (int) $contract->rental->tenant_id, 403);

        $contract->update([
            'tenant_signature'   => 'signed',
            'tenant_signed_at'   => now(),
        ]);

        if ($contract->owner_signature === 'signed') {
            $contract->update(['status' => 'signed']);
        }

        return back()->with('success', 'Contract signed successfully.');
    }

    public function ownerSign(Request $request, Contract $contract)
    {
        $this->authorize('view', $contract->rental);

        $data = $request->validate([
            'owner_signature' => ['required', 'string'],
        ]);

        abort_unless((int) Auth::id() === (int) $contract->rental->owner_id, 403);

        $contract->update([
            'owner_signature'   => 'signed',
            'owner_signed_at'   => now(),
        ]);

        if ($contract->tenant_signature === 'signed') {
            $contract->update(['status' => 'signed']);
        }

        return back()->with('success', 'Contract signed by owner.');
    }
}
