<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminRentalController extends Controller
{
    public function index(Request $request)
    {
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
            ->when($request->status, fn ($query) => $query->where('status', $request->status))
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
            'filters' => $request->only(['status', 'search']),
        ]);
    }
}
