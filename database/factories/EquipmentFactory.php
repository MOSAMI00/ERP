<?php

namespace Database\Factories;

use App\Domains\Equipment\Enums\EquipmentStatus;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class EquipmentFactory extends Factory
{
    protected $model = Equipment::class;

    public function definition(): array
    {
        return [
            'owner_id' => \App\Models\User::factory(),
            'category_id' => \App\Models\Category::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->paragraph(),
            'governorate' => fake()->city(),
            'address' => fake()->address(),
            'price_per_day' => fake()->randomFloat(2, 50, 500),
            'insurance_amount' => fake()->randomFloat(2, 100, 1000),
            'rental_terms' => fake()->sentence(),
            'status' => EquipmentStatus::Active->value,
            'rating' => fake()->randomFloat(2, 1, 5),
            'review_count' => fake()->numberBetween(0, 50),
        ];
    }
}
