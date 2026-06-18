<?php

namespace App\Models;
use App\Domains\User\Enums\UserStatus;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\KycDocument;
use App\Models\UserPaymentMethod;
use App\Models\Review;
use App\Models\Dispute;
use App\Models\HandoverReport;
use App\Models\EquipmentHandover;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'full_name',
        'email',
        'phone',
        'password_hash',
        'avatar',
        'type',
        'status',
        'ban_reason',
        'kyc_status',
        'rating',
        'operations_count',
        'governorate',
    ];

    protected $hidden = [
        'password_hash',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'status' => UserStatus::class,
            'rating' => 'float',
            'operations_count' => 'integer',
        ];
    }

    public function getAuthPassword()
    {
        return $this->password_hash;
    }

    public function getNameAttribute(): ?string
    {
        return $this->full_name;
    }

    public function setNameAttribute(?string $value): void
    {
        $this->attributes['full_name'] = $value;
    }

    public function getPasswordAttribute(): ?string
    {
        return $this->password_hash;
    }

    public function setPasswordAttribute(?string $value): void
    {
        $this->attributes['password_hash'] = $value;
    }

    public function equipment()
    {
        return $this->hasMany(Equipment::class, 'owner_id');
    }

    public function rentalsAsTenant()
    {
        return $this->hasMany(RentalOperation::class, 'tenant_id');
    }

    public function rentalsAsOwner()
    {
        return $this->hasMany(RentalOperation::class, 'owner_id');
    }

    public function kycDocuments()
    {
        return $this->hasMany(KycDocument::class, 'user_id');
    }

    public function paymentMethods()
    {
        return $this->hasMany(UserPaymentMethod::class, 'user_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function disputes()
    {
        return $this->hasMany(Dispute::class, 'raised_by_id');
    }

    public function submittedHandoverReports()
    {
        return $this->hasMany(HandoverReport::class, 'submitted_by_id');
    }

    public function confirmedHandoverReports()
    {
        return $this->hasMany(HandoverReport::class, 'confirmed_by_id');
    }

    public function handoverDecisions()
    {
        return $this->hasMany(EquipmentHandover::class, 'decided_by_id');
    }
}
