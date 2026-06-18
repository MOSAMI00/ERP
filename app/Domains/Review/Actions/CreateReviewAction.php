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

        $targetType = $data['target_type'] ?? 'user';
        $targetId = $targetType === 'equipment'
            ? $rental->equipment_id
            : $revieweeId;

        return Review::create([
            'reviewer_id'         => $reviewer->id,
            'target_id'           => $targetId,
            'target_type'         => $targetType,
            'rental_op_id'        => $rental->id,
            'rating'              => $data['rating'],
            'review_text'         => $data['review_text'] ?? $data['comment'] ?? null,
            'status'              => ReviewStatus::Visible->value,
        ]);
    }
}
