<?php

namespace App\Models;
use App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminRole extends Model
{
    use HasFactory;

    protected $fillable = [
        'role_name',
        'can_manage_users',
        'can_manage_equipment',
        'can_manage_rentals',
        'can_manage_disputes',
        'can_manage_financial',
        'can_manage_reviews',
        'can_view_audit_log',
        'can_manage_settings',
    ];

    protected $casts = [
        'can_manage_users' => 'boolean',
        'can_manage_equipment' => 'boolean',
        'can_manage_rentals' => 'boolean',
        'can_manage_disputes' => 'boolean',
        'can_manage_financial' => 'boolean',
        'can_manage_reviews' => 'boolean',
        'can_view_audit_log' => 'boolean',
        'can_manage_settings' => 'boolean',
    ];

    public function admins()
    {
        return $this->hasMany(Admin::class, 'role_id');
    }
}
