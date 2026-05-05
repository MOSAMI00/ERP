<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalOperation extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'owner_id',
        'equipment_id',
        'start_date',
        'end_date',
        'duration_days',
        'rental_amount',
        'insurance_amount',
        'total_amount',
        'status',
        'cancellation_reason',
        'delivery_location',
        'delivery_time',
        'delivery_confirmed_at',
        'return_confirmed_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'delivery_time' => 'datetime',
        'delivery_confirmed_at' => 'datetime',
        'return_confirmed_at' => 'datetime',
    ];

    public function tenant()
    {
        return $this->belongsTo(User::class, 'tenant_id');
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }

    public function contract()
    {
        return $this->hasOne(Contract::class, 'rental_op_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'rental_op_id');
    }

    public function handoverReports()
    {
        return $this->hasMany(HandoverReport::class, 'rental_op_id');
    }

    public function finalHandover()
    {
        return $this->hasOne(EquipmentHandover::class, 'rental_op_id');
    }

    public function dispute()
    {
        return $this->hasOne(Dispute::class, 'rental_op_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'rental_op_id');
    }
}