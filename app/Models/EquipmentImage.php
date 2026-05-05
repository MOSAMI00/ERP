<?php

namespace App\Models;
use App\Models\Equipment;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class EquipmentImage extends Model
{
    use HasFactory;

    protected $fillable = ['equipment_id', 'image_url', 'sort_order'];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class, 'equipment_id');
    }
}
