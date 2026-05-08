<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Equipment;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::with(['category', 'images'])
            ->where('status', 'active')
            ->latest()
            ->paginate(12);

        return Inertia::render('Equipment/Index', [
            'equipment' => $equipment,
        ]);
    }

    public function create()
    {
        return Inertia::render('Equipment/Create', [
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validate([
            'category_id'      => ['required', 'exists:categories,id'],
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'governorate'      => ['required', 'string'],
            'address'          => ['required', 'string'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'insurance_amount' => ['required', 'numeric', 'min:0'],
            'rental_terms'     => ['required', 'string'],
        ]);

        $equipment = $user->equipment()->create($data);

        return redirect()->route('equipment.show', $equipment)
            ->with('success', 'Equipment created successfully.');
    }

    public function show(Equipment $equipment)
    {
        $equipment->load(['category', 'images', 'availability', 'owner']);

        return Inertia::render('Equipment/Show', [
            'equipment' => $equipment,
        ]);
    }

    public function edit(Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        return Inertia::render('Equipment/Edit', [
            'equipment'  => $equipment->load('images'),
            'categories' => Category::all(),
        ]);
    }

    public function update(Request $request, Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'description'      => ['required', 'string'],
            'governorate'      => ['required', 'string'],
            'address'          => ['required', 'string'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'insurance_amount' => ['required', 'numeric', 'min:0'],
            'rental_terms'     => ['required', 'string'],
            'status'           => ['nullable', 'in:active,hidden'],
        ]);

        $equipment->update($data);

        return redirect()->route('equipment.show', $equipment)
            ->with('success', 'Equipment updated.');
    }

    public function destroy(Equipment $equipment)
    {
        $this->authorize('delete', $equipment);

        $equipment->update(['status' => 'deleted']);
        $equipment->delete();

        return redirect()->route('owner.equipment.index')
            ->with('success', 'Equipment deleted.');
    }
}