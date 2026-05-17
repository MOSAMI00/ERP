<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            CategorySeeder::class,
            AdminSeeder::class,
            UserSeeder::class,
            // RentalWorkflowSeeder::class,
        ]);
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'full_name' => 'Test User',
                'phone' => '0500000000',
                'type' => 'tenant',
                'governorate' => 'Riyadh',
                'status' => 'active',
                'kyc_status' => 'approved',
                'password_hash' => \Illuminate\Support\Facades\Hash::make('password'),
            ]
        );
    }
}
