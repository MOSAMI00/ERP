<?php

namespace App\Domains\Review\Actions;

use App\Domains\Review\Enums\ReviewStatus;
use App\Models\Review;

class UpdateReviewStatusAction
{
    public function __invoke(Review $review, ReviewStatus $status): Review
    {
        $review->update(['status' => $status->value]);

        return $review->refresh();
    }
}
