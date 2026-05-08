<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\RentalOperation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
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

        Review::create([
            ...$data,
            'reviewer_id' => Auth::id(),
            'status'      => 'visible',
        ]);

        // update rating average
        $this->updateRating($data['target_type'], $data['target_id']);

        return redirect()->route('rentals.show', $data['rental_op_id'])
            ->with('success', 'Review submitted.');
    }

    private function updateRating(string $type, int $id): void
    {
        $avg = Review::where('target_type', $type)
            ->where('target_id', $id)
            ->where('status', 'visible')
            ->avg('rating');

        if ($type === 'user') {
            \App\Models\User::find($id)?->update(['rating' => round($avg, 2)]);
        } else {
            \App\Models\Equipment::find($id)?->update(['rating' => round($avg, 2)]);
        }
    }
}