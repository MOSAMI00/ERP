<?php

namespace App\Http\Controllers\Admin;

use App\Domains\User\Services\KycVerificationService;
use App\Http\Controllers\Controller;
use App\Models\KycDocument;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\RejectKycRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminKycController extends Controller
{
    public function __construct(
        private KycVerificationService $kyc,
    ) {}

    public function index(Request $request)
    {
        $docs = KycDocument::with('user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, function ($q) use ($request) {
                $term = "%{$request->search}%";

                $q->whereHas('user', fn ($userQuery) => $userQuery
                    ->where('full_name', 'like', $term)
                    ->orWhere('email', 'like', $term));
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Kyc/Index', [
            'documents' => $docs,
            'filters'   => $request->only(['status', 'search']),
        ]);
    }

    public function approve(KycDocument $document)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->kyc->approve($document, $admin);

        return back()->with('success', 'KYC approved.');
    }

    public function reject(RejectKycRequest $request, KycDocument $document)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $data = $request->validated();

        $this->kyc->reject($document, $admin, $data['rejection_reason'] ?? 'Rejected by admin.');

        return back()->with('success', 'KYC rejected.');
    }
}
