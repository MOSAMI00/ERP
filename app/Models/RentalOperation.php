<?php

namespace App\Models;

use App\Domains\Rental\Enums\RentalStatus;
use App\Models\User;
use App\Models\Equipment;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\HandoverReport;
use App\Models\EquipmentHandover;
use App\Models\Dispute;
use App\Models\Review;

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
        'payment_deadline',
        'delivery_location',
        'delivery_time',
        'delivery_confirmed_at',
        'return_confirmed_at',
    ];

    // protected $casts = [
    //     'start_date' => 'date',
    //     'end_date' => 'date',
    //     'delivery_time' => 'datetime',
    //     'delivery_confirmed_at' => 'datetime',
    //     'return_confirmed_at' => 'datetime',
    // ];
    protected function casts(): array
    {
        return [
            'status'               => RentalStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'payment_deadline' => 'datetime',
            'delivery_time' => 'datetime',
            'delivery_confirmed_at' => 'datetime',
            'return_confirmed_at' => 'datetime',
            'rental_amount' => 'decimal:2',
            'insurance_amount' => 'decimal:2',
            'total_amount' => 'decimal:2',
        ];
    }


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

    public function equipmentHandover()
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
