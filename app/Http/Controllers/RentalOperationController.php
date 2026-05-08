<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\RentalOperation;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RentalOperationController extends Controller
{
    public function index()
    {
        /** @var User $user */
        $user = Auth::user();

        $rentals = $user->type === 'tenant'
            ? $user->rentalsAsTenant()->with(['equipment', 'owner'])->latest()->paginate(10)
            : $user->rentalsAsOwner()->with(['equipment', 'tenant'])->latest()->paginate(10);

        return Inertia::render('Rentals/Index', [
            'rentals' => $rentals,
        ]);
    }

    public function create(Equipment $equipment)
    {
        return Inertia::render('Rentals/Create', [
            'equipment' => $equipment->load(['images', 'owner', 'availability']),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'equipment_id'      => ['required', 'exists:equipment,id'],
            'start_date'        => ['required', 'date', 'after:today'],
            'end_date'          => ['required', 'date', 'after:start_date'],
            'delivery_location' => ['required', 'string'],
        ]);

        $equipment = Equipment::findOrFail($data['equipment_id']);
        $days = now()->parse($data['start_date'])->diffInDays($data['end_date']);

        $rental = RentalOperation::create([
            'equipment_id'     => $data['equipment_id'],
            'start_date'       => $data['start_date'],
            'end_date'         => $data['end_date'],
            'delivery_location'=> $data['delivery_location'],
            'tenant_id'        => Auth::id(),
            'owner_id'         => $equipment->owner_id,
            'duration_days'    => $days,
            'rental_amount'    => $equipment->price_per_day * $days,
            'insurance_amount' => $equipment->insurance_amount,
            'total_amount'     => ($equipment->price_per_day * $days) + $equipment->insurance_amount,
            'status'           => 'pending',
        ]);

        return redirect()->route('rentals.show', $rental)
            ->with('success', 'Rental request sent.');
    }

    public function show(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        $rental->load(['equipment.images', 'tenant', 'owner', 'contract', 'payments']);

        return Inertia::render('Rentals/Show', [
            'rental' => $rental,
        ]);
    }

    public function confirm(RentalOperation $rental)
    {
        $this->authorize('confirm', $rental);

        $rental->update(['status' => 'confirmed']);

        return back()->with('success', 'Rental confirmed.');
    }

    public function cancel(Request $request, RentalOperation $rental)
    {
        $this->authorize('cancel', $rental);

        $data = $request->validate([
            'cancellation_reason' => ['required', 'string'],
        ]);

        $rental->update([
            'status'              => 'cancelled',
            'cancellation_reason' => $data['cancellation_reason'],
        ]);

        return back()->with('success', 'Rental cancelled.');
    }
}