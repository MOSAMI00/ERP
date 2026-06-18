<?php

namespace App\Models;
use App\Domains\Review\Enums\ReviewStatus;
use App\Models\Admin;
use App\Models\User;
use App\Models\RentalOperation;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'reviewer_id',
        'target_id',
        'target_type',
        'rental_op_id',
        'rating',
        'review_text',
        'status',
        'deleted_by_id',
    ];

    protected $casts = [
        'status' => ReviewStatus::class,
        'rating' => 'decimal:2',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function rental()
    {
        return $this->belongsTo(RentalOperation::class, 'rental_op_id');
    }

    public function deletedBy()
    {
        return $this->belongsTo(Admin::class, 'deleted_by_id');
    }

    public function target()
    {
        return $this->morphTo(__FUNCTION__, 'target_type', 'target_id');
    }
}
