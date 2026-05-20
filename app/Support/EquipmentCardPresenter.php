<?php

namespace App\Support;

use App\Models\Equipment;

class EquipmentCardPresenter
{
    public function present(Equipment $equipment): array
    {
        $primaryImage = $equipment->images->firstWhere('is_primary', true) ?? $equipment->images->first();
        $owner = $equipment->owner;

        return [
            'id' => $equipment->id,
            'name' => $equipment->name,
            'description' => $equipment->description,
            'category' => $equipment->category?->name_ar,
            'price' => (float) $equipment->price_per_day,
            'price_per_day' => (float) $equipment->price_per_day,
            'insurance' => (float) $equipment->insurance_amount,
            'insurance_amount' => (float) $equipment->insurance_amount,
            'location' => $equipment->governorate,
            'address' => $equipment->address,
            'rental_terms' => $equipment->rental_terms,
            'status' => $equipment->status?->value ?? $equipment->status,
            'rating' => (float) $equipment->rating,
            'image' => $primaryImage?->image_url,
            'images' => $equipment->images->pluck('image_url')->values(),
            'owner' => $owner ? [
                'id' => $owner->id,
                'full_name' => $owner->full_name,
                'avatar' => $owner->avatar,
                'rating' => $owner->rating,
                'operations_count' => $owner->operations_count,
                'governorate' => $owner->governorate,
                'kyc_status' => $owner->kyc_status,
                'created_at' => $owner->created_at?->toIso8601String(),
            ] : null,
        ];
    }
}
