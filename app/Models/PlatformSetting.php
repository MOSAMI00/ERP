<?php

namespace App\Models;
use App\Models\Admin;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'platform_fee_rate',
        'payment_deadline_hours',
        'min_rental_days',
        'max_rental_days',
        'objection_window_hours',
        'refund_window_days',
        'kyc_required',
        'updated_by',
    ];

    protected $casts = [
        'platform_fee_rate' => 'decimal:2',
        'payment_deadline_hours' => 'integer',
        'min_rental_days' => 'integer',
        'max_rental_days' => 'integer',
        'objection_window_hours' => 'integer',
        'refund_window_days' => 'integer',
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
