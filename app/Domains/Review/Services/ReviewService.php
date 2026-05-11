<?php

namespace App\Domains\Review\Services;

use App\Domains\Review\Actions\CreateReviewAction;
use App\Domains\Review\Actions\UpdateReviewStatusAction;
use App\Domains\Review\Enums\ReviewStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Shared\Audit\AuditLogService;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\Review;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    public function __construct(
        private CreateReviewAction       $createReview,
        private UpdateReviewStatusAction $updateStatus,
        private AuditLogService          $audit,
    ) {}

    public function submitReview(RentalOperation $rental, User $reviewer, array $data): Review
    {
        $this->mustBeCompleted($rental);
        $this->mustBelongToRental($rental, $reviewer);
        $this->mustNotBeDuplicate($rental, $reviewer);
        $this->mustBeValidRating($data['rating']);

        return DB::transaction(function () use ($rental, $reviewer, $data) {
            $review = ($this->createReview)($rental, $reviewer, $data);
            $this->recalculateEquipmentRating($rental->equipment);
            $this->audit->log('review_submitted', $review);
            return $review;
        });
    }

    public function hideReview(Review $review, User $admin): Review
    {
        DB::transaction(function () use ($review, $admin) {
            ($this->updateStatus)($review, ReviewStatus::Hidden);
            $this->recalculateEquipmentRating($review->equipment);
            $this->audit->log('review_hidden', $review, $admin);
        });

        return $review->refresh();
    }

    public function restoreReview(Review $review, User $admin): Review
    {
        DB::transaction(function () use ($review, $admin) {
            ($this->updateStatus)($review, ReviewStatus::Published);
            $this->recalculateEquipmentRating($review->equipment);
            $this->audit->log('review_restored', $review, $admin);
        });

        return $review->refresh();
    }

    private function mustBeCompleted(RentalOperation $rental): void
    {
        if ($rental->status !== RentalStatus::Completed) {
            throw new \DomainException('Reviews can only be submitted for completed rentals.');
        }
    }

    private function mustBelongToRental(RentalOperation $rental, User $reviewer): void
    {
        if (
            $reviewer->id !== $rental->tenant_id &&
            $reviewer->id !== $rental->owner_id
        ) {
            throw new \DomainException('You are not a participant in this rental.');
        }
    }

    private function mustNotBeDuplicate(RentalOperation $rental, User $reviewer): void
    {
        $exists = $rental->reviews()->where('reviewer_id', $reviewer->id)->exists();

        if ($exists) {
            throw new \DomainException('You have already reviewed this rental.');
        }
    }

    private function mustBeValidRating(mixed $rating): void
    {
        if (
            ! is_numeric($rating) ||
            $rating < 1 ||
            $rating > 5
        ) {
            throw new \DomainException('Rating must be between 1 and 5.');
        }
    }

    private function recalculateEquipmentRating(Equipment $equipment): void
    {
        $published = $equipment->reviews()->where('status', ReviewStatus::Published->value);

        $equipment->update([
            'rating'       => round($published->avg('rating') ?? 0.0, 2),
            'review_count' => $published->count(),
        ]);
    }
}
