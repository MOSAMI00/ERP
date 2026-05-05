<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Admin extends Model
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