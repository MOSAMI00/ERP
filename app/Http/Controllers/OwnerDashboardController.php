<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Contract;
use App\Models\Dispute;
use App\Models\Equipment;
use App\Models\EquipmentHandover;
use App\Models\HandoverReport;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OwnerDashboardController extends Controller
{
    public function root(): RedirectResponse
    {
        return redirect()->route('owner.overview');
    }

    public function overview(Request $request): Response
    {
        $rentals = $request->user()->rentalsAsOwner()
            ->with(['equipment', 'tenant', 'payments'])
            ->latest()
            ->get();

        return Inertia::render('Owner/Overview/OverviewPage', [
            'rentals' => $rentals,
            'equipment' => $request->user()->equipment()->with(['category', 'images'])->latest()->get(),
            'stats' => [
                'equipment_count' => $request->user()->equipment()->count(),
                'pending_requests' => $rentals->where('status', 'pending')->count(),
                'active_rentals' => $rentals->whereIn('status', ['confirmed', 'paid', 'in_use'])->count(),
                'earnings' => (float) Payment::whereIn('rental_op_id', $rentals->pluck('id'))->where('status', 'paid')->sum('amount'),
            ],
        ]);
    }

    public function equipment(Request $request): Response
    {
        return Inertia::render('Owner/Equipment/EquipmentPage', [
            'equipment' => $request->user()->equipment()->with(['category', 'images'])->latest()->get(),
            'rentals' => $request->user()->rentalsAsOwner()->latest()->get(),
        ]);
    }

    public function addEquipment(): Response
    {
        return Inertia::render('Owner/AddEquipment/AddEquipmentPage', [
            'categories' => Category::orderBy('sort_order')->get(),
        ]);
    }

    public function editEquipment(Request $request, Equipment $equipment): Response
    {
        abort_unless((int) $equipment->owner_id === (int) $request->user()->id, 403);

        return Inertia::render('Owner/AddEquipment/AddEquipmentPage', [
            'equipment' => $equipment->load(['category', 'images']),
            'categories' => Category::orderBy('sort_order')->get(),
            'mode' => 'edit',
        ]);
    }

    public function requests(Request $request): Response
    {
        return Inertia::render('Owner/Requests/RequestsPage', [
            'rentals' => $request->user()->rentalsAsOwner()
                ->with(['equipment.images', 'tenant', 'contract', 'payments'])
                ->latest()
                ->get(),
        ]);
    }

    public function rentals(Request $request): RedirectResponse
    {
        if ($request->filled('selected')) {
            $rental = $request->user()->rentalsAsOwner()
                ->select('id')
                ->findOrFail($request->selected);

            return redirect()->route('rentals.show', $rental);
        }

        return redirect()->route('owner.requests');
    }

    public function delivery(Request $request): Response
    {
        $rentals = $request->user()->rentalsAsOwner()
            ->with(['equipment.images', 'equipmentHandover.dispute', 'tenant', 'owner'])
            ->latest()
            ->get();

        return Inertia::render('Owner/Delivery/DeliveryPage', [
            'rentals' => $rentals,
            'handover_reports' => HandoverReport::whereIn('rental_op_id', $rentals->pluck('id'))->with('images')->latest()->get(),
            'disputes' => Dispute::whereIn('rental_op_id', $rentals->pluck('id'))->with('handover')->latest()->get(),
            'reviews' => Review::whereIn('rental_op_id', $rentals->pluck('id'))->where('reviewer_id', $request->user()->id)->get(),
            'compensations' => EquipmentHandover::whereIn('rental_op_id', $rentals->pluck('id'))->with('dispute')->get(),
            'selected_id' => $request->query('id'),
        ]);
    }

    public function insurance(Request $request): Response
    {
        return Inertia::render('Owner/Insurance/InsurancePage', [
            'rentals' => $request->user()->rentalsAsOwner()
                ->with(['equipment', 'tenant', 'owner', 'payments', 'equipmentHandover.dispute'])
                ->latest()
                ->get(),
        ]);
    }

    public function earnings(Request $request): Response
    {
        $user = $request->user();
        $rentalIds = $user->rentalsAsOwner()->pluck('id');

        return Inertia::render('Owner/Earnings/EarningsPage', [
            'payments' => Payment::whereIn('rental_op_id', $rentalIds)
                ->with(['rental.equipment', 'rental.tenant'])
                ->latest()
                ->get(),
            'payment_methods' => $user->paymentMethods()->latest()->get(),
        ]);
    }

    public function contracts(Request $request): Response
    {
        $rentalIds = $request->user()->rentalsAsOwner()->pluck('id');

        return Inertia::render('Owner/Contracts/ContractsPage', [
            'contracts' => Contract::whereIn('rental_op_id', $rentalIds)
                ->with(['rental.equipment', 'rental.owner', 'rental.tenant'])
                ->latest()
                ->get(),
        ]);
    }

    public function notifications(Request $request): Response
    {
        return Inertia::render('Owner/Notifications/NotificationsPage', [
            'notifications' => Notification::where('recipient_type', 'user')
                ->where('recipient_id', $request->user()->id)
                ->latest()
                ->get(),
        ]);
    }

    public function reviews(Request $request): Response
    {
        $user = $request->user();
        $rentalIds = $user->rentalsAsOwner()->pluck('id');

        return Inertia::render('Owner/Reviews/ReviewsPage', [
            'reviews' => Review::whereIn('rental_op_id', $rentalIds)
                ->orWhere('reviewer_id', $user->id)
                ->orWhere('target_id', $user->id)
                ->with(['reviewer', 'target', 'rental.equipment'])
                ->latest()
                ->get(),
            'rentals' => $user->rentalsAsOwner()
                ->where('status', 'completed')
                ->with(['equipment.images', 'tenant'])
                ->latest()
                ->get(),
        ]);
    }

    public function profile(Request $request): Response
    {
        return Inertia::render('Owner/Settings/SettingsPage', [
            'kyc_documents' => $request->user()->kycDocuments()->latest()->get(),
            'kyc_status' => $request->user()->kyc_status,
            'payment_methods' => $request->user()->paymentMethods()->latest()->get(),
        ]);
    }
}
