<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Dispute\Enums\AdminDecision;
use App\Domains\Dispute\Enums\DisputeStatus;
use App\Domains\Dispute\Services\DisputeWorkflowService;
use App\Http\Controllers\Controller;
use App\Models\Dispute;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\ResolveDisputeRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminDisputeController extends Controller
{
    public function __construct(
        private DisputeWorkflowService $workflow,
    ) {}

    public function index(Request $request)
    {
        $disputes = Dispute::with(['rental.equipment', 'raisedBy'])
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Disputes/Index', [
            'disputes' => $disputes,
            'filters'  => $request->only('status'),
        ]);
    }

    public function show(Dispute $dispute)
    {
        return Inertia::render('Admin/Disputes/Show', [
            'dispute' => $dispute->load([
                'rental.equipment',
                'rental.tenant',
                'rental.owner',
                'raisedBy',
                'handover',
            ]),
        ]);
    }

    public function resolve(ResolveDisputeRequest $request, Dispute $dispute)
    {
        $data = $request->validated();

        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        if ($dispute->status === DisputeStatus::Open) {
            $this->workflow->startReview($dispute, $admin);
            $dispute->refresh();
        }

        match ($data['admin_decision']) {
            AdminDecision::AcceptDeduction->value => $this->workflow->acceptDeduction(
                $dispute,
                $admin,
                $data['admin_note'],
            ),
            AdminDecision::RejectDeduction->value => $this->workflow->rejectDeduction(
                $dispute,
                $admin,
                $data['admin_note'],
            ),
            AdminDecision::ModifyCompensation->value => $this->workflow->modifyCompensation(
                $dispute,
                $admin,
                (float) ($data['final_compensation'] ?? 0),
                $data['admin_note'],
            ),
        };

        return back()->with('success', 'Dispute resolved.');
    }
}
