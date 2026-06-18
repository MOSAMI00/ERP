<?php

namespace App\Models;
use App\Domains\Dispute\Enums\AdminDecision;
use App\Domains\Dispute\Enums\DisputeStatus;
use App\Models\RentalOperation;
use App\Models\EquipmentHandover;
use App\Models\User;
use App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_op_id',
        'equipment_handover_id',
        'raised_by_id',
        'tenant_claim',
        'owner_notes',
        'requested_amount',
        'status',
        'admin_decision',
        'final_compensation',
        'admin_note',
        'resolved_by_id',
        'resolved_at',
    ];

    protected $casts = [
        'status' => DisputeStatus::class,
        'admin_decision' => AdminDecision::class,
        'requested_amount' => 'decimal:2',
        'final_compensation' => 'decimal:2',
        'resolved_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function handover()
    {
        return $this->belongsTo(EquipmentHandover::class, 'equipment_handover_id');
    }

    public function raisedBy()
    {
        return $this->belongsTo(User::class, 'raised_by_id');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(Admin::class, 'resolved_by_id');
    }
}
