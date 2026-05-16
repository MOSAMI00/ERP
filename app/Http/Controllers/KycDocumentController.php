<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KycDocument;
use Illuminate\Http\Request;
use App\Http\Requests\StoreKycDocumentRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class KycDocumentController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        return Inertia::render('Kyc/Index', [
            'kyc_documents' => $user->kycDocuments()->latest()->get(),
            'kyc_status'    => $user->kyc_status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Kyc/Create');
    }

    public function store(StoreKycDocumentRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validated();

        $frontPath = $request->file('front_image')
            ->store("kyc/{$user->id}", 'public');

        $backPath = $request->hasFile('back_image')
            ? $request->file('back_image')->store("kyc/{$user->id}", 'public')
            : null;

        $selfiePath = $request->file('selfie_image')
            ->store("kyc/{$user->id}", 'public');

        // منع رفع وثائق جديدة إذا كانت هناك وثيقة pending أو approved
        $existing = $user->kycDocuments()
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existing) {
            return back()->withErrors([
                'doc_type' => 'لديك وثائق قيد المراجعة أو معتمدة مسبقاً.',
            ]);
        }

        $user->kycDocuments()->create([
            'doc_type'     => $request->doc_type,
            'front_url'    => $frontPath,
            'back_url'     => $backPath,
            'selfie_url'   => $selfiePath,
            'status'       => 'pending',
            'submitted_at' => now(),
        ]);

        $user->update(['kyc_status' => 'pending']);

        return redirect()->route('kyc.index')
            ->with('success', 'تم رفع الوثائق بنجاح. في انتظار المراجعة.');
    }
}
