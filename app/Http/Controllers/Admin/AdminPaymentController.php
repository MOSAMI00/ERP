<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminPaymentController extends Controller
{
    public function index(Request $request)
    {
        $payments = Payment::with(['rental.equipment', 'rental.tenant', 'rental.owner', 'payer'])
            ->when(
                $request->status,
                fn($q) => $q->where('status', $request->status)
            )
            ->when(
                $request->type,
                fn($q) => $q->where('type', $request->type)
            )
            ->when(
                $request->search,
                fn($q) => $q->where('transaction_ref', 'like', "%{$request->search}%")
                    ->orWhereHas(
                        'payer',
                        fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                    )
            )
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Payments/Index', [
            'payments' => $payments,
            'filters'  => $request->only(['status', 'type', 'search']),
            'summary'  => [
                'total_completed' => Payment::where('status', 'completed')->sum('amount'),
                'total_pending'   => Payment::where('status', 'pending')->sum('amount'),
                'total_refunds'   => Payment::where('type', 'refund')->where('status', 'completed')->sum('amount'),
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
        $payment->update([
            'status'  => 'completed',
            'paid_at' => now(),
        ]);

        // تسجيل في الـ Audit Log
        \App\Models\AuditLog::create([
            'admin_id'   => Auth::id(),
            'event_type' => 'payment_approved',
            'target_id'  => $payment->id,
            'target_type'=> 'payment',
            'notes'      => "Payment #{$payment->id} approved by admin.",
        ]);

        return back()->with('success', 'Payment approved.');
    }

    public function reject(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'rejection_reason' => ['required', 'string', 'max:500'],
        ]);

        $payment->update([
            'status' => 'failed',
            'notes'  => $data['rejection_reason'],
        ]);

        \App\Models\AuditLog::create([
            'admin_id'    => Auth::id(),
            'event_type'  => 'payment_rejected',
            'target_id'   => $payment->id,
            'target_type' => 'payment',
            'notes'       => "Payment #{$payment->id} rejected. Reason: {$data['rejection_reason']}",
        ]);

        return back()->with('success', 'Payment rejected.');
    }

    public function refund(Request $request, Payment $payment)
    {
        $data = $request->validate([
            'refund_amount' => ['required', 'numeric', 'min:0', 'max:' . $payment->amount],
            'refund_reason' => ['required', 'string'],
        ]);

        // إنشاء payment جديد من نوع refund
        Payment::create([
            'rental_op_id'   => $payment->rental_op_id,
            'payer_id'       => $payment->payer_id,
            'amount'         => $data['refund_amount'],
            'type'           => 'refund',
            'payment_method' => $payment->payment_method,
            'status'         => 'completed',
            'paid_at'        => now(),
            'notes'          => $data['refund_reason'],
        ]);

        \App\Models\AuditLog::create([
            'admin_id'    => Auth::id(),
            'event_type'  => 'payment_refunded',
            'target_id'   => $payment->id,
            'target_type' => 'payment',
            'notes'       => "Refund of {$data['refund_amount']} issued for Payment #{$payment->id}.",
        ]);

        return back()->with('success', 'Refund issued successfully.');
    }
}