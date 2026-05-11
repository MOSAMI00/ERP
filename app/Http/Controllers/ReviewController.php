<?php

namespace App\Http\Controllers;

use App\Domains\Review\Services\ReviewService;
use App\Models\Review;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
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

    public function store(Request $request)
    {
        $data = $request->validate([
            'rental_op_id' => ['required', 'exists:rental_operations,id'],
            'target_id'    => ['required', 'integer'],
            'target_type'  => ['required', 'in:user,equipment'],
            'rating'       => ['required', 'numeric', 'min:1', 'max:5'],
            'review_text'  => ['nullable', 'string', 'max:1000'],
        ]);

        $rental = RentalOperation::findOrFail($data['rental_op_id']);
        $this->authorize('create', [Review::class, $rental]);

        $this->reviews->submitReview($rental, $request->user(), $data);

        return redirect()->route('rentals.show', $data['rental_op_id'])
            ->with('success', 'Review submitted.');
    }

}
