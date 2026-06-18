<?php

namespace App\Models;
use App\Domains\Handover\Enums\ConditionStatus;
use App\Domains\Handover\Enums\HandoverPhase;
use App\Models\RentalOperation;
use App\Models\HandoverImage;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HandoverReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_op_id',
        'phase',
        'submitted_by_id',
        'submitted_by_role',
        'notes',
        'has_issues',
        'condition_status',
        'confirmed_by_id',
        'confirmed_by_role',
        'confirmed_at',
    ];

    protected $casts = [
        'phase' => HandoverPhase::class,
        'condition_status' => ConditionStatus::class,
        'has_issues' => 'boolean',
        'confirmed_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function images()
    {
        return $this->hasMany(HandoverImage::class, 'handover_report_id');
    }

    public function submittedBy()
    {
        return $this->belongsTo(User::class, 'submitted_by_id');
    }

    public function confirmedBy()
    {
        return $this->belongsTo(User::class, 'confirmed_by_id');
    }
}
