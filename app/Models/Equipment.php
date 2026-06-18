<?php

namespace App\Models;
use App\Domains\Equipment\Enums\EquipmentStatus;
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

    protected $casts = [
        'status' => EquipmentStatus::class,
        'price_per_day' => 'decimal:2',
        'insurance_amount' => 'decimal:2',
        'rating' => 'float',
        'rentals_count' => 'integer',
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

    public function reviews()
    {
        return $this->hasMany(Review::class, 'target_id')
            ->where('target_type', 'equipment');
    }
}
