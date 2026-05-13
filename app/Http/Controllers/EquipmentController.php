<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Equipment;
use App\Models\Category;
use App\Domains\Equipment\Enums\EquipmentStatus;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEquipmentRequest;
use App\Http\Requests\UpdateEquipmentRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index()
    {
        $equipment = Equipment::with(['category', 'images'])
            ->where('status', EquipmentStatus::Active->value)
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

    public function store(StoreEquipmentRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        $data = $request->validated();
        $data['status'] = EquipmentStatus::Active->value;

        $equipment = $user->equipment()->create($data);

        \Illuminate\Support\Facades\Log::info('Equipment created', ['id' => $equipment->id]);
        \Illuminate\Support\Facades\Log::info('Request files', ['files' => $request->allFiles()]);

        if ($request->hasFile('images')) {
            \Illuminate\Support\Facades\Log::info('Images found in request', ['count' => count($request->file('images'))]);
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('equipment', 'public');
                $equipment->images()->create([
                    'image_url' => '/storage/' . $path,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        } else {
            \Illuminate\Support\Facades\Log::warning('No images found in request');
        }

        return redirect()->route('owner.equipment')
            ->with('success', 'تمت إضافة المعدة بنجاح.');
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

    public function update(UpdateEquipmentRequest $request, Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        $data = $request->validated();

        $equipment->update($data);

        return redirect()->route('equipment.show', $equipment)
            ->with('success', 'Equipment updated.');
    }

    public function destroy(Equipment $equipment)
    {
        $this->authorize('delete', $equipment);

        $equipment->update(['status' => EquipmentStatus::Deleted->value]);
        $equipment->delete();

        return redirect()->route('equipment.index')
            ->with('success', 'Equipment deleted.');
    }
}