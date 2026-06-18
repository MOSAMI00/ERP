<?php

namespace Database\Factories;

use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        return [
            'rental_op_id' => \App\Models\RentalOperation::factory(),
            'payer_id' => \App\Models\User::factory(),
            'amount' => fake()->randomFloat(2, 50, 1000),
            'type' => PaymentType::Rental->value,
            'payment_method' => fake()->randomElement(['bank_transfer', 'platform_wallet']),
            'status' => PaymentStatus::Pending->value,
            'transaction_ref' => strtoupper(Str::random(10)),
        ];
    }
}
