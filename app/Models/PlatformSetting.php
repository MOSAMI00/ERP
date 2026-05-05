<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform_fee_rate',
        'min_rental_days',
        'max_rental_days',
        'objection_window_hours',
        'refund_window_days',
        'kyc_required',
        'updated_by',
    ];

    public $timestamps = false; // because you only used updated_at

    protected $casts = [
        'kyc_required' => 'boolean',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONSHIPS
    |--------------------------------------------------------------------------
    */

    public function updatedBy()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }
}