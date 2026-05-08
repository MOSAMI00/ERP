<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KycDocument;
use Illuminate\Http\Request;
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
            'documents' => $user->kycDocuments()->latest()->get(),
            'kycStatus' => $user->kyc_status,
        ]);
    }

    public function create()
    {
        return Inertia::render('Kyc/Create');
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $request->validate([
            'doc_type'    => ['required', 'in:national_id,passport,military_id'],
            'front_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
            'back_image'  => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:4096'],
        ]);

        $frontPath = $request->file('front_image')
            ->store("kyc/{$user->id}", 'public');

        $backPath = $request->hasFile('back_image')
            ? $request->file('back_image')->store("kyc/{$user->id}", 'public')
            : null;

        // منع رفع وثائق جديدة إذا كانت هناك وثيقة pending أو verified
        $existing = $user->kycDocuments()
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existing) {
            return back()->withErrors([
                'doc_type' => 'لديك وثائق قيد المراجعة أو معتمدة مسبقاً.',
            ]);
        }

        $user->kycDocuments()->create([
            'doc_type'    => $request->doc_type,
            'front_image' => $frontPath,
            'back_image'  => $backPath,
            'status'      => 'pending',
        ]);

        $user->update(['kyc_status' => 'pending']);

        return redirect()->route('kyc.index')
            ->with('success', 'تم رفع الوثائق بنجاح. في انتظار المراجعة.');
    }
}