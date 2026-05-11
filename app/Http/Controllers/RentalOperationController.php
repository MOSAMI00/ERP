<?php

namespace App\Http\Controllers;

use App\Domains\Rental\Services\RentalWorkflowService;
use App\Models\User;
use App\Models\RentalOperation;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RentalOperationController extends Controller
{
    public function __construct(
        private RentalWorkflowService $workflow,
    ) {}

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

        $rental = $this->workflow->createRental($data, $request->user());

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

        $this->workflow->approveRental($rental);

        return back()->with('success', 'Rental confirmed.');
    }

    public function cancel(Request $request, RentalOperation $rental)
    {
        $this->authorize('cancel', $rental);

        $data = $request->validate([
            'cancellation_reason' => ['required', 'string'],
        ]);

        if ((int) Auth::id() === (int) $rental->owner_id) {
            $this->workflow->cancelByOwner($rental, $data['cancellation_reason']);
        } else {
            $this->workflow->cancelByTenant($rental, $data['cancellation_reason']);
        }

        return back()->with('success', 'Rental cancelled.');
    }
}
