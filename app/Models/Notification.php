<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_id',
        'recipient_type',
        'type',
        'title',
        'body',
        'reference_type',
        'reference_id',
        'action_url',
        'is_read',
        'priority',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
    ];

    public function recipient()
    {
        return $this->morphTo(__FUNCTION__, 'recipient_type', 'recipient_id');
    }
}
