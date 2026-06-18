<?php
namespace App\Domains\Admin\Actions;

use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class CreateAdminAction
{
    public function __invoke(array $data): Admin
    {
        return Admin::create([
            'name'          => $data['name'],
            'email'         => $data['email'],
            'password_hash' => Hash::make($data['password']),
            'role_id'       => $data['role_id'],
            'status'        => 'active',
        ]);
    }
}