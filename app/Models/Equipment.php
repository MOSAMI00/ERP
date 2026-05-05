<?php

namespace App\Models;
use App\Models\User;
use App\Models\Category;
use App\Models\EquipmentImage;
use App\Models\EquipmentAvailability;
use App\Models\RentalOperation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'owner_id',
        'category_id',
        'name',
        'description',
        'governorate',
        'address',
        'price_per_day',
        'insurance_amount',
        'rental_terms',
        'status',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function images()
    {
        return $this->hasMany(EquipmentImage::class, 'equipment_id');
    }

    public function availability()
    {
        return $this->hasMany(EquipmentAvailability::class, 'equipment_id');
    }

    public function rentals()
    {
        return $this->hasMany(RentalOperation::class, 'equipment_id');
    }
}