<?php

namespace App\Models;
use App\Domains\User\Enums\KycStatus;
use App\Models\User;
use App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KycDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'doc_type',
        'front_url',
        'back_url',
        'status',
        'reviewed_by',
        'submitted_at',
    ];

    protected $casts = [
        'status' => KycStatus::class,
        'submitted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(Admin::class, 'reviewed_by');
    }
}
