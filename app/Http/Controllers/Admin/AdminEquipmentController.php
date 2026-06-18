<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Domains\Equipment\Services\EquipmentManagementService;
use App\Http\Controllers\Controller;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminEquipmentController extends Controller
{
    public function __construct(
        private EquipmentManagementService $equipmentService,
    ) {}

    public function index(Request $request)
    {
        $status = in_array($request->status, array_map(fn ($case) => $case->value, EquipmentStatus::cases()), true)
            ? $request->status
            : null;

        $equipment = Equipment::with(['owner', 'category', 'images'])
            ->withCount('rentals')
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($request->category_id, fn ($query) => $query->where('category_id', $request->category_id))
            ->when($request->search, function ($query) use ($request) {
                $term = "%{$request->search}%";

                $query->where(fn ($q) => $q
                    ->where('name', 'like', $term)
                    ->orWhereHas('owner', fn ($ownerQuery) => $ownerQuery->where('full_name', 'like', $term))
                );
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Equipment/Index', [
            'equipment' => $equipment,
            'filters' => array_merge($request->only(['category_id', 'search']), ['status' => $status]),
        ]);
    }

    public function toggleVisibility(Equipment $equipment)
    {
        $this->equipmentService->toggleVisibility($equipment);

        return back()->with('success', 'Equipment visibility updated.');
    }

    public function destroy(Equipment $equipment)
    {
        $this->equipmentService->deleteEquipment($equipment);

        return back()->with('success', 'Equipment deleted.');
    }
}
