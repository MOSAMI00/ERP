<?php

namespace Database\Factories;

use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminFactory extends Factory
{
    protected $model = Admin::class;
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password_hash' => static::$password ??= Hash::make('password'),
            'role_id' => $this->ensureAdminRole(),
            'status' => 'active',
        ];
    }

    /**
     * Ensure an admin role exists and return its ID.
     * This prevents FK violations in test environments using RefreshDatabase.
     */
    private function ensureAdminRole(): int
    {
        $role = \App\Models\AdminRole::firstOrCreate(
            ['role_name' => 'Super Admin'],
            [
                'role_name' => 'Super Admin',
                'can_manage_users' => true,
                'can_manage_equipment' => true,
                'can_manage_rentals' => true,
                'can_manage_disputes' => true,
                'can_manage_financial' => true,
                'can_manage_reviews' => true,
                'can_view_audit_log' => true,
                'can_manage_settings' => true,
            ],
        );

        return $role->id;
    }
}
