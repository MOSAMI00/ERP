<?php

namespace App\Models;
use App\Models\RentalOperation;
use App\Models\User;
use App\Models\Dispute;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentHandover extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_op_id',
        'actual_return_date',
        'actual_rental_days',
        'late_fee',
        'final_condition',
        'final_notes',
        'proposed_deduction',
        'owner_decision',
        'decided_by_id',
        'decided_at',
        'objection_deadline',
        'objection_submitted_at',
    ];

    protected $casts = [
        'actual_return_date' => 'date',
        'decided_at' => 'datetime',
        'objection_deadline' => 'datetime',
        'objection_submitted_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function decidedBy()
    {
        return $this->belongsTo(User::class, 'decided_by_id');
    }

    public function dispute()
    {
        return $this->hasOne(Dispute::class, 'equipment_handover_id');
    }
}