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
        $this->mustNotBeDuplicate($rental, $reviewer, $data);
        $this->mustBeValidRating($data['rating']);

        return DB::transaction(function () use ($rental, $reviewer, $data) {
            $review = ($this->createReview)($rental, $reviewer, $data);
            $this->recalculateTargetRating($review);
            $this->audit->log('review_submitted', $review);
            return $review;
        });
    }

    public function hideReview(Review $review, User $admin): Review
    {
        DB::transaction(function () use ($review, $admin) {
            ($this->updateStatus)($review, ReviewStatus::Hidden);
            $this->recalculateTargetRating($review);
            $this->audit->log('review_hidden', $review, $admin);
        });

        return $review->refresh();
    }

    public function restoreReview(Review $review, User $admin): Review
    {
        DB::transaction(function () use ($review, $admin) {
            ($this->updateStatus)($review, ReviewStatus::Visible);
            $this->recalculateTargetRating($review);
            $this->audit->log('review_restored', $review, $admin);
        });

        return $review->refresh();
    }

    public function deleteReview(Review $review, User $admin): void
    {
        DB::transaction(function () use ($review, $admin) {
            $targetType = $review->target_type;
            $targetId = $review->target_id;
            
            $review->delete();
            
            // Re-fetch to recalculate without this review
            if ($targetType === 'equipment') {
                $equipment = Equipment::find($targetId);
                if ($equipment) {
                    $this->recalculateEquipmentRating($equipment);
                }
            } else {
                $avg = Review::where('target_type', 'user')
                    ->where('target_id', $targetId)
                    ->where('status', ReviewStatus::Visible->value)
                    ->avg('rating');
        
                User::find($targetId)?->update(['rating' => round($avg ?? 0.0, 2)]);
            }

            $this->audit->log('review_deleted', $review, $admin);
        });
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

    private function mustNotBeDuplicate(RentalOperation $rental, User $reviewer, array $data): void
    {
        $targetType = $data['target_type'] ?? 'user';
        $revieweeId = $reviewer->id === $rental->tenant_id
            ? $rental->owner_id
            : $rental->tenant_id;
        $targetId = $targetType === 'equipment' ? $rental->equipment_id : $revieweeId;

        $exists = $rental->reviews()
            ->where('reviewer_id', $reviewer->id)
            ->where('target_type', $targetType)
            ->where('target_id', $targetId)
            ->exists();

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

    private function recalculateTargetRating(Review $review): void
    {
        if ($review->target_type === 'equipment') {
            $equipment = Equipment::find($review->target_id);
            if ($equipment) {
                $this->recalculateEquipmentRating($equipment);
            }

            return;
        }

        $avg = Review::where('target_type', 'user')
            ->where('target_id', $review->target_id)
            ->where('status', ReviewStatus::Visible->value)
            ->avg('rating');

        User::find($review->target_id)?->update(['rating' => round($avg ?? 0.0, 2)]);
    }

    private function recalculateEquipmentRating(Equipment $equipment): void
    {
        $published = $equipment->reviews()->where('status', ReviewStatus::Visible->value);

        $equipment->update([
            'rating' => round($published->avg('rating') ?? 0.0, 2),
        ]);
    }
}
