<?php

namespace App\Models;
use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Payment\Enums\PaymentType;
use App\Models\RentalOperation;
use App\Models\Admin;
use App\Models\User;

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
        'payer_id',
        'payment_method',
        'transaction_ref',
        'escrow_status',
        'stop_reason',
        'stopped_by_id',
        'paid_at',
        'transferred_at',
        'refunded_at',
        'cancelled_at',
    ];

    protected $casts = [
        'type' => PaymentType::class,
        'status' => PaymentStatus::class,
        'escrow_status' => EscrowStatus::class,
        'amount' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'paid_at' => 'datetime',
        'transferred_at' => 'datetime',
        'refunded_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function stoppedBy()
    {
        return $this->belongsTo(Admin::class, 'stopped_by_id');
    }

    public function payer()
    {
        return $this->belongsTo(User::class, 'payer_id');
    }
}
