<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\RentalOperation;
use App\Http\Requests\SignContractRequest;
use App\Shared\Audit\AuditLogService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ContractController extends Controller
{
    public function __construct(
        private AuditLogService $audit,
    ) {}

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

    public function tenantSign(SignContractRequest $request, Contract $contract)
    {
        $this->authorize('view', $contract->rental);

        $request->validated();

        abort_unless((int) Auth::id() === (int) $contract->rental->tenant_id, 403);

        DB::transaction(function () use ($contract) {
            $contract = Contract::query()->whereKey($contract->id)->lockForUpdate()->firstOrFail();

            $contract->update([
                'tenant_signature' => 'signed',
                'tenant_signed_at' => now(),
            ]);

            if ($contract->owner_signature === 'signed') {
                $contract->update(['status' => 'signed']);
            }

            $this->audit->log('contract_signed_by_tenant', $contract->rental);
        });

        return back()->with('success', 'Contract signed successfully.');
    }

    public function ownerSign(SignContractRequest $request, Contract $contract)
    {
        $this->authorize('view', $contract->rental);

        $request->validated();

        abort_unless((int) Auth::id() === (int) $contract->rental->owner_id, 403);

        DB::transaction(function () use ($contract) {
            $contract = Contract::query()->whereKey($contract->id)->lockForUpdate()->firstOrFail();

            $contract->update([
                'owner_signature' => 'signed',
                'owner_signed_at' => now(),
            ]);

            if ($contract->tenant_signature === 'signed') {
                $contract->update(['status' => 'signed']);
            }

            $this->audit->log('contract_signed_by_owner', $contract->rental);
        });

        return back()->with('success', 'Contract signed by owner.');
    }
}
