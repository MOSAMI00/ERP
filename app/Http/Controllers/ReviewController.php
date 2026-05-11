<?php

namespace App\Http\Controllers;

use App\Domains\Review\Services\ReviewService;
use App\Models\Review;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use App\Http\Requests\StoreReviewRequest;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct(
        private ReviewService $reviews,
    ) {}

    public function create(RentalOperation $rental)
    {
        $this->authorize('view', $rental);

        return Inertia::render('Reviews/Create', [
            'rental' => $rental->load(['equipment', 'owner', 'tenant']),
        ]);
    }

    public function store(StoreReviewRequest $request)
    {
        $data = $request->validated();

        $rental = RentalOperation::findOrFail($data['rental_op_id']);
        $this->authorize('create', [Review::class, $rental]);

        $this->reviews->submitReview($rental, $request->user(), $data);

        return redirect()->route('rentals.show', $data['rental_op_id'])
            ->with('success', 'Review submitted.');
    }

}
