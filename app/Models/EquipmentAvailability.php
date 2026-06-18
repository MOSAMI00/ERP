<?php

namespace App\Models;
use App\Domains\Equipment\Enums\AvailabilityReason;
use App\Models\Equipment;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentAvailability extends Model
{
    use HasFactory;

    protected $table = 'equipment_availability';

    protected $fillable = [
        'equipment_id',
        'unavailable_from',
        'unavailable_to',
        'reason',
    ];

    protected $casts = [
        'reason' => AvailabilityReason::class,
        'unavailable_from' => 'date',
        'unavailable_to' => 'date',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }
}
