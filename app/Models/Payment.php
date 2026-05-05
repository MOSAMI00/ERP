<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_op_id',
        'type',
        'amount',
        'platform_fee',
        'status',
        'payment_method',
        'transaction_ref',
        'escrow_status',
        'stop_reason',
        'stopped_by_id',
        'paid_at',
        'transferred_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'transferred_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function stoppedBy()
    {
        return $this->belongsTo(Admin::class, 'stopped_by_id');
    }
}