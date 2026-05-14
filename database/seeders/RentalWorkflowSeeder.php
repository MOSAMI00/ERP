<?php

namespace Database\Seeders;

use App\Models\Contract;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class RentalWorkflowSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('type', 'owner')->first() ?? User::create([
            'full_name' => 'Owner Test',
            'email' => 'owner@test.com',
            'phone' => '770000001',
            'password_hash' => bcrypt('password'),
            'type' => 'owner',
            'status' => 'active',
            'kyc_status' => 'verified',
        ]);

        $tenant = User::where('type', 'tenant')->first() ?? User::create([
            'full_name' => 'Tenant Test',
            'email' => 'tenant@test.com',
            'phone' => '770000002',
            'password_hash' => bcrypt('password'),
            'type' => 'tenant',
            'status' => 'active',
            'kyc_status' => 'verified',
        ]);

        $equipment = Equipment::first() ?? Equipment::create([
            'owner_id' => $owner->id,
            'category_id' => 1, // Assuming category 1 exists from previous seeder
            'name' => 'Generater 50KVA',
            'description' => 'Powerful generator for construction sites.',
            'governorate' => 'صنعاء',
            'address' => 'شارع الستين',
            'price_per_day' => 5000,
            'insurance_amount' => 20000,
            'rental_terms' => 'Must be handled by professionals.',
            'status' => 'active',
        ]);

        // Create a sample rental operation
        $rental = RentalOperation::create([
            'tenant_id' => $tenant->id,
            'owner_id' => $owner->id,
            'equipment_id' => $equipment->id,
            'start_date' => Carbon::now()->addDays(2),
            'end_date' => Carbon::now()->addDays(5),
            'duration_days' => 3,
            'rental_amount' => 15000,
            'insurance_amount' => 20000,
            'total_amount' => 35000,
            'status' => 'pending',
            'delivery_location' => 'صنعاء - حدة',
        ]);

        // Create the associated contract
        Contract::create([
            'rental_op_id' => $rental->id,
            'contract_body' => "عقد تأجير معدة: {$equipment->name}\n\nيوافق الطرفان على شروط التأجير المذكورة...",
            'tenant_signature' => 'pending',
            'owner_signature' => 'pending',
            'status' => 'pending',
        ]);
    }
}
