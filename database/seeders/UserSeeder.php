<?php

namespace Database\Seeders;

use App\Models\User;
use App\Domains\User\Enums\UserStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $governorates = ['Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Tabuk', 'Abha', 'Taif', 'Jazan'];

        // Seed 10 Tenants
        for ($i = 1; $i <= 10; $i++) {
            $status = UserStatus::Active;
            $kycStatus = 'approved';
            $banReason = null;

            if ($i === 7) {
                $kycStatus = 'rejected';
            } elseif ($i === 8) {
                $kycStatus = 'pending';
            } elseif ($i === 9) {
                $status = UserStatus::Suspended;
            } elseif ($i === 10) {
                $status = UserStatus::Banned;
                $banReason = 'Violated terms of service';
            }

            User::updateOrCreate(
                ['email' => "tenant{$i}@example.com"],
                [
                    'full_name' => "Tenant User {$i}",
                    'phone' => sprintf('050%07d', $i),
                    'password_hash' => Hash::make('password'),
                    'type' => 'tenant',
                    'status' => $status,
                    'kyc_status' => $kycStatus,
                    'ban_reason' => $banReason,
                    'rating' => 4.5 + ($i % 5) * 0.1,
                    'operations_count' => $i * 2,
                    'governorate' => $governorates[($i - 1) % count($governorates)],
                ]
            );
        }

        // Seed 10 Owners
        for ($i = 1; $i <= 10; $i++) {
            $status = UserStatus::Active;
            $kycStatus = 'approved';
            $banReason = null;

            if ($i === 7) {
                $kycStatus = 'rejected';
            } elseif ($i === 8) {
                $kycStatus = 'pending';
            } elseif ($i === 9) {
                $status = UserStatus::Suspended;
            } elseif ($i === 10) {
                $status = UserStatus::Banned;
                $banReason = 'Violated owner policies';
            }

            User::updateOrCreate(
                ['email' => "owner{$i}@example.com"],
                [
                    'full_name' => "Owner User {$i}",
                    'phone' => sprintf('051%07d', $i),
                    'password_hash' => Hash::make('password'),
                    'type' => 'owner',
                    'status' => $status,
                    'kyc_status' => $kycStatus,
                    'ban_reason' => $banReason,
                    'rating' => 4.5 + ($i % 5) * 0.1,
                    'operations_count' => $i * 3,
                    'governorate' => $governorates[($i - 1) % count($governorates)],
                ]
            );
        }
    }
}
