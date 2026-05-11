<?php

namespace App\Models;
use App\Domains\Admin\Enums\AdminStatus;
use App\Models\AdminRole;
use App\Models\AuditLog;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'password_hash',
        'role_id',
        'status',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected $casts = [
        'status' => AdminStatus::class,
    ];

    public function role()
    {
        return $this->belongsTo(AdminRole::class, 'role_id');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'admin_id');
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
