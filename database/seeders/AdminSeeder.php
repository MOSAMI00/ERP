<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\AdminRole;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Create Super Admin Role
        $role = AdminRole::updateOrCreate(
            ['role_name' => 'super_admin'],
            [
                'can_manage_users'     => true,
                'can_manage_equipment' => true,
                'can_manage_rentals'   => true,
                'can_manage_disputes'  => true,
                'can_manage_financial' => true,
                'can_manage_reviews'   => true,
                'can_view_audit_log'   => true,
                'can_manage_settings'  => true,
            ]
        );

        // Create Default Admin User
        Admin::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name'          => 'Super Admin',
                'password_hash' => Hash::make('password'),
                'role_id'       => $role->id,
                'status'        => 'active',
            ]
        );
    }
}
