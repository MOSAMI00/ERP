<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Rental\Enums\RentalStatus;
use App\Http\Controllers\Controller;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRentalController extends Controller
{
    public function index(Request $request)
    {
        $status = in_array($request->status, array_map(fn ($case) => $case->value, RentalStatus::cases()), true)
            ? $request->status
            : null;

        $rentals = RentalOperation::with([
                'equipment.images',
                'tenant',
                'owner',
                'contract',
                'payments',
                'handoverReports.images',
                'equipmentHandover',
                'dispute',
            ])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->when($request->search, function ($query) use ($request) {
                $term = "%{$request->search}%";

                $query->where(fn ($q) => $q
                    ->whereHas('tenant', fn ($tenantQuery) => $tenantQuery->where('full_name', 'like', $term))
                    ->orWhereHas('owner', fn ($q) => $q->where('full_name', 'like', $term))
                    ->orWhereHas('equipment', fn ($equipmentQuery) => $equipmentQuery->where('name', 'like', $term))
                );
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Rentals/Index', [
            'rentals' => $rentals,
            'filters' => array_merge($request->only(['search']), ['status' => $status]),
        ]);
    }
}
