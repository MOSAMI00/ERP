<?php

namespace App\Http\Controllers;

use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Models\Equipment;
use App\Models\EquipmentAvailability;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEquipmentAvailabilityRequest;
use Inertia\Inertia;

class EquipmentAvailabilityController extends Controller
{
    public function index(Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        return Inertia::render('Equipment/Availability', [
            'equipment'    => $equipment,
            'availability' => $equipment->availability()->get(),
        ]);
    }

    public function store(StoreEquipmentAvailabilityRequest $request, Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        $data = $request->validated();

        if ($data['status'] === 'available') {
            EquipmentAvailability::where('equipment_id', $equipment->id)
                ->where('unavailable_from', $data['start_date'])
                ->where('unavailable_to', $data['end_date'])
                ->where('reason', AvailabilityReason::OwnerBlocked->value)
                ->delete();
        } else {
            EquipmentAvailability::create([
                'equipment_id' => $equipment->id,
                'unavailable_from' => $data['start_date'],
                'unavailable_to' => $data['end_date'],
                'reason' => AvailabilityReason::OwnerBlocked->value,
            ]);
        }

        return back()->with('success', 'Availability updated.');
    }

    public function destroy(EquipmentAvailability $availability)
    {
        $this->authorize('update', $availability->equipment);

        $availability->delete();

        return back()->with('success', 'Availability entry removed.');
    }
}
