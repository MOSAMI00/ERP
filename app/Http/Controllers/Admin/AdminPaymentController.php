<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Payment;
use App\Domains\Payment\Services\PaymentWorkflowService;
use App\Http\Requests\Admin\RejectPaymentRequest;
use App\Http\Requests\Admin\RefundPaymentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function __construct(
        private PaymentWorkflowService $paymentWorkflow,
    ) {}

    public function index(Request $request)
    {
        $status = in_array($request->status, array_map(fn ($case) => $case->value, PaymentStatus::cases()), true)
            ? $request->status
            : null;

        $payments = Payment::with(['rental.equipment', 'rental.tenant', 'rental.owner', 'payer'])
            ->when(
                $status,
                fn($q) => $q->where('status', $status)
            )
            ->when(
                $request->type,
                fn($q) => $q->where('type', $request->type)
            )
            ->when(
                $request->escrow_status,
                fn($q) => $q->where('escrow_status', $request->escrow_status)
            )
            ->when(
                $request->search,
                fn($q) => $q->where(fn ($searchQuery) => $searchQuery
                    ->where('transaction_ref', 'like', "%{$request->search}%")
                    ->orWhereHas(
                        'payer',
                        fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                    )
                    ->orWhereHas(
                        'rental.tenant',
                        fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                    )
                    ->orWhereHas(
                        'rental.owner',
                        fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                    )
                    ->orWhereHas(
                        'rental.equipment',
                        fn($q) => $q->where('name', 'like', "%{$request->search}%")
                    )
                )
            )
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters'  => array_merge($request->only(['type', 'escrow_status', 'search']), ['status' => $status]),
            'summary'  => [
                'total_completed' => Payment::where('status', PaymentStatus::Paid->value)->sum('amount'),
                'total_pending'   => Payment::where('escrow_status', EscrowStatus::Held->value)->sum('amount'),
                'total_refunds'   => Payment::where('type', PaymentType::InsuranceRefund->value)->where('status', PaymentStatus::Paid->value)->sum('amount'),
                'total_profits'   => Payment::where('type', PaymentType::OwnerTransfer->value)->where('status', PaymentStatus::Paid->value)->sum('amount'),
            ],
        ]);
    }

    public function show(Payment $payment)
    {
        return Inertia::render('Admin/Payments/Show', [
            'payment' => $payment->load([
                'rental.equipment',
                'rental.tenant',
                'rental.owner',
                'payer',
            ]),
        ]);
    }

    public function approve(Request $request, Payment $payment)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->paymentWorkflow->adminApprove($payment, $admin);

        return back()->with('success', 'Payment approved.');
    }

    public function reject(RejectPaymentRequest $request, Payment $payment)
    {
        $data = $request->validated();

        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->paymentWorkflow->adminReject($payment, $admin, $data['rejection_reason']);

        return back()->with('success', 'Payment rejected.');
    }

    public function refund(RefundPaymentRequest $request, Payment $payment)
    {
        $data = $request->validated();

        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->paymentWorkflow->adminRefund($payment, $admin, (float) $data['refund_amount'], $data['refund_reason']);

        return back()->with('success', 'Refund issued successfully.');
    }
}
