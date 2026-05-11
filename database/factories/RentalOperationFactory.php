<?php

namespace Database\Factories;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\RentalOperation;
use Illuminate\Database\Eloquent\Factories\Factory;

class RentalOperationFactory extends Factory
{
    protected $model = RentalOperation::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('now', '+1 week');
        $end = (clone $start)->modify('+'.fake()->numberBetween(1, 10).' days');
        
        return [
            'tenant_id' => \App\Models\User::factory(),
            'owner_id' => \App\Models\User::factory(),
            'equipment_id' => \App\Models\Equipment::factory(),
            'status' => RentalStatus::Pending->value,
            'start_date' => $start,
            'end_date' => $end,
            'total_days' => $start->diff($end)->days,
            'daily_rate' => 100,
            'insurance_amount' => 200,
            'platform_fee' => 10,
            'total_amount' => (100 * $start->diff($end)->days) + 200 + 10,
            'delivery_location' => fake()->address(),
        ];
    }
}
