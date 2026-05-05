<?php

namespace App\Models;
use App\Models\RentalOperation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contract extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_op_id',
        'contract_body',
        'tenant_signature',
        'owner_signature',
        'tenant_signed_at',
        'owner_signed_at',
    ];

    protected $casts = [
        'tenant_signed_at' => 'datetime',
        'owner_signed_at' => 'datetime',
    ];

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }
}