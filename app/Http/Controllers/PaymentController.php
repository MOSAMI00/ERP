<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::whereHas('rental', function ($q) {
                $q->where('tenant_id', Auth::id())
                  ->orWhere('owner_id', Auth::id());
            })
            ->with(['rental.equipment'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
        ]);
    }

    public function create(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        return Inertia::render('Payments/Create', [
            'rental'          => $rental->load(['equipment', 'owner']),
            'paymentMethods'  => Auth::user()->paymentMethods,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'rental_op_id'     => ['required', 'exists:rental_operations,id'],
            'amount'           => ['required', 'numeric', 'min:0'],
            'type'             => ['required', 'in:rental,insurance,refund,platform_fee'],
            'payment_method'   => ['required', 'in:bank_transfer,cash,platform_wallet'],
            'transaction_ref'  => ['nullable', 'string'],
        ]);

        $payment = Payment::create([
            ...$data,
            'payer_id'   => Auth::id(),
            'status'     => 'pending',
            'paid_at'    => null,
        ]);

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment initiated.');
    }

    public function show(Payment $payment)
    {
        return Inertia::render('Payments/Show', [
            'payment' => $payment->load(['rental.equipment', 'payer']),
        ]);
    }

    public function confirm(Payment $payment)
    {
        $payment->update([
            'status'  => 'completed',
            'paid_at' => now(),
        ]);

        return back()->with('success', 'Payment confirmed.');
    }
}