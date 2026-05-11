<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentImage;
use Illuminate\Http\Request;
use App\Http\Requests\StoreEquipmentImageRequest;
use Inertia\Inertia;

class EquipmentImageController extends Controller
{
    public function store(StoreEquipmentImageRequest $request, Equipment $equipment)
    {
        $this->authorize('update', $equipment);

        $request->validated();

        foreach ($request->file('images') as $index => $image) {
            $path = $image->store("equipment/{$equipment->id}", 'public');

            EquipmentImage::create([
                'equipment_id' => $equipment->id,
                'image_url'    => $path,
                'sort_order'   => $equipment->images()->count() + $index,
                'is_primary'   => $equipment->images()->count() === 0 && $index === 0,
            ]);
        }

        return back()->with('success', 'Images uploaded successfully.');
    }

    public function setPrimary(EquipmentImage $image)
    {
        $this->authorize('update', $image->equipment);

        // reset all images for this equipment
        EquipmentImage::where('equipment_id', $image->equipment_id)
            ->update(['is_primary' => false]);

        $image->update(['is_primary' => true]);

        return back()->with('success', 'Primary image updated.');
    }

    public function destroy(EquipmentImage $image)
    {
        $this->authorize('update', $image->equipment);

        \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_url);
        $image->delete();

        return back()->with('success', 'Image deleted.');
    }
}