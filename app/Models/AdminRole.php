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

    public function admins()
    {
        return $this->hasMany(Admin::class, 'role_id');
    }
}