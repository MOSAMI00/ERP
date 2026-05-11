<?php

namespace App\Domains\Review\Actions;

use App\Domains\Review\Enums\ReviewStatus;
use App\Models\RentalOperation;
use App\Models\Review;
use App\Models\User;

class CreateReviewAction
{
    public function __invoke(RentalOperation $rental, User $reviewer, array $data): Review
    {
        $revieweeId = $reviewer->id === $rental->tenant_id
            ? $rental->owner_id
            : $rental->tenant_id;

        return Review::create([
            'rental_operation_id' => $rental->id,
            'equipment_id'        => $rental->equipment_id,
            'reviewer_id'         => $reviewer->id,
            'reviewee_id'         => $revieweeId,
            'rating'              => $data['rating'],
            'comment'             => $data['comment'] ?? null,
            'status'              => ReviewStatus::Published,
        ]);
    }
}