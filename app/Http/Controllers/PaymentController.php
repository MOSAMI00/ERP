<?php

namespace App\Http\Controllers;

use App\Domains\Payment\Services\PaymentWorkflowService;
use App\Models\Payment;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use App\Http\Requests\StorePaymentRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentWorkflowService $workflow,
    ) {}

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

    public function store(StorePaymentRequest $request)
    {
        $data = $request->validated();

        $rental = RentalOperation::findOrFail($data['rental_op_id']);
        $this->authorize('view', $rental);
        abort_unless((int) Auth::id() === (int) $rental->tenant_id, 403);

        $payment = $this->workflow->processPayment($rental, $data);

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment initiated.');
    }

    public function show(Payment $payment)
    {
        $payment->load(['rental.equipment', 'rental.owner', 'rental.tenant', 'payer']);
        $this->authorize('view', $payment->rental);

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }

    public function confirm(Payment $payment)
    {
        abort(403);

        return back();
    }
}
