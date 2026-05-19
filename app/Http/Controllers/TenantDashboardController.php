<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Dispute;
use App\Models\EquipmentHandover;
use App\Models\HandoverReport;
use App\Models\Notification;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TenantDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Tenant/Orders/MyOrders/MyOrdersPage', [
            'rentals' => $request->user()->rentalsAsTenant()
                ->with(['equipment.images', 'equipment.owner', 'owner', 'contract', 'payments'])
                ->latest()
                ->get(),
        ]);
    }

    public function order(Request $request, int|string $id): RedirectResponse
    {
        $rental = $request->user()->rentalsAsTenant()
            ->select('id')
            ->findOrFail($id);

        return redirect()->route('rentals.show', $rental);
    }

    public function orderDelivery(int|string $id): RedirectResponse
    {
        return redirect()->route('dashboard.delivery', ['id' => $id]);
    }

    public function delivery(Request $request): Response
    {
        $rentals = $request->user()->rentalsAsTenant()
            ->with(['equipment.images', 'equipmentHandover.dispute', 'tenant', 'owner'])
            ->latest()
            ->get();

        return Inertia::render('Tenant/Delivery/DeliveryPage', [
            'rentals' => $rentals,
            'handover_reports' => HandoverReport::whereIn('rental_op_id', $rentals->pluck('id'))->with('images')->latest()->get(),
            'disputes' => Dispute::whereIn('rental_op_id', $rentals->pluck('id'))->with('handover')->latest()->get(),
            'reviews' => Review::whereIn('rental_op_id', $rentals->pluck('id'))->where('reviewer_id', $request->user()->id)->get(),
            'compensations' => EquipmentHandover::whereIn('rental_op_id', $rentals->pluck('id'))->with('dispute')->get(),
            'selected_id' => $request->query('id'),
        ]);
    }

    public function contracts(Request $request): Response
    {
        $rentalIds = $request->user()->rentalsAsTenant()->pluck('id');

        return Inertia::render('Tenant/Contracts/ContractsPage', [
            'contracts' => Contract::whereIn('rental_op_id', $rentalIds)
                ->with(['rental.equipment', 'rental.owner', 'rental.tenant'])
                ->latest()
                ->get(),
        ]);
    }

    public function notifications(Request $request): Response
    {
        return Inertia::render('Tenant/Notifications/NotificationsPage', [
            'notifications' => Notification::where('recipient_type', 'user')
                ->where('recipient_id', $request->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    public function ratings(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Tenant/Reviews/ReviewsPage', [
            'reviews' => Review::where('reviewer_id', $user->id)
                ->orWhere('target_id', $user->id)
                ->with(['rental.equipment', 'reviewer', 'target'])
                ->latest()
                ->get(),
            'rentals' => $user->rentalsAsTenant()
                ->where('status', 'completed')
                ->with(['equipment.images', 'equipment.owner', 'owner'])
                ->latest()
                ->get(),
        ]);
    }

    public function insurance(Request $request): Response
    {
        return Inertia::render('Tenant/Insurance/InsurancePage', [
            'rentals' => $request->user()->rentalsAsTenant()
                ->with(['equipment', 'tenant', 'owner', 'payments', 'equipmentHandover.dispute'])
                ->latest()
                ->get(),
        ]);
    }

    public function settings(Request $request): Response
    {
        return Inertia::render('Tenant/Settings/SettingsPage', [
            'kyc_documents' => $request->user()->kycDocuments()->latest()->get(),
            'kyc_status' => $request->user()->kyc_status,
            'payment_methods' => $request->user()->paymentMethods()->latest()->get(),
        ]);
    }
}
