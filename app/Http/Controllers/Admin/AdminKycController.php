<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\KycDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminKycController extends Controller
{
    public function index(Request $request)
    {
        $docs = KycDocument::with('user')
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Kyc/Index', [
            'documents' => $docs,
            'filters'   => $request->only('status'),
        ]);
    }

    public function approve(KycDocument $document)
    {
        $document->update(['status' => 'approved', 'reviewed_by' => Auth::id()]);
        $document->user->update(['kyc_status' => 'verified']);

        return back()->with('success', 'KYC approved.');
    }

    public function reject(KycDocument $document)
    {
        $document->update(['status' => 'rejected', 'reviewed_by' => Auth::id()]);
        $document->user->update(['kyc_status' => 'rejected']);

        return back()->with('success', 'KYC rejected.');
    }
}