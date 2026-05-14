<?php

namespace App\Http\Controllers;

use App\Domains\Rental\Services\RentalWorkflowService;
use App\Models\User;
use App\Models\RentalOperation;
use App\Models\Equipment;
use Illuminate\Http\Request;
use App\Http\Requests\StoreRentalRequest;
use App\Http\Requests\CancelRentalRequest;
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

    public function store(StoreRentalRequest $request)
    {
        $data = $request->validated();
        
        if (empty($data['delivery_location'])) {
            $equipment = Equipment::findOrFail($data['equipment_id']);
            $data['delivery_location'] = $equipment->location ?? 'صنعاء';
        }

        try {
            $rental = $this->workflow->createRental($data, $request->user());
        } catch (\App\Domains\Shared\Exceptions\InvalidStateTransitionException $e) {
            return back()->withErrors(['equipment_id' => $e->getMessage()]);
        } catch (\App\Domains\Shared\Exceptions\UnauthorizedDomainActionException $e) {
            return back()->withErrors(['equipment_id' => $e->getMessage()]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'حدث خطأ غير متوقع: ' . $e->getMessage()]);
        }

        return redirect()->route('rentals.show', $rental)
            ->with('success', 'Rental request sent.');
    }

    public function show(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        $rental->load([
            'equipment.images',
            'tenant',
            'owner',
            'contract',
            'payments',
            'handoverReports',
            'equipmentHandover',
            'reviews',
        ]);

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

    public function cancel(CancelRentalRequest $request, RentalOperation $rental)
    {
        $this->authorize('cancel', $rental);

        $data = $request->validated();

        if ((int) Auth::id() === (int) $rental->owner_id) {
            $this->workflow->cancelByOwner($rental, $data['cancellation_reason']);
        } else {
            $this->workflow->cancelByTenant($rental, $data['cancellation_reason']);
        }

        return back()->with('success', 'Rental cancelled.');
    }
}
