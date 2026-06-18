<?php

namespace App\Domains\Equipment\Actions;

use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Models\Equipment;
use App\Models\User;

class CreateEquipmentAction
{
    public function __invoke(array $data, User $owner): Equipment
    {
        return Equipment::create([
            'owner_id'         => $owner->id,
            'category_id'      => $data['category_id'],
            'name'             => $data['name'],
            'description'      => $data['description'],
            'governorate'      => $data['governorate'],
            'address'          => $data['address'] ?? null,
            'price_per_day'    => $data['price_per_day'],
            'insurance_amount' => $data['insurance_amount'],
            'rental_terms'     => $data['rental_terms'] ?? null,
            'status'           => EquipmentStatus::Active,
        ]);
    }
}