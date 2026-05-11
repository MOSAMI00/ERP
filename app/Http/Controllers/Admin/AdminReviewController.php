<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Domains\Review\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function __construct(
        private ReviewService $reviewService,
    ) {}

    public function index(Request $request)
    {
        $reviews = Review::with(['reviewer', 'rental.equipment'])
            ->when(
                $request->status,
                fn($q) => $q->where('status', $request->status)
            )
            ->when(
                $request->target_type,
                fn($q) => $q->where('target_type', $request->target_type)
            )
            ->when(
                $request->search,
                fn($q) => $q->whereHas(
                    'reviewer',
                    fn($q) => $q->where('full_name', 'like', "%{$request->search}%")
                )
            )
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'filters' => $request->only(['status', 'target_type', 'search']),
        ]);
    }

    public function show(Review $review)
    {
        return Inertia::render('Admin/Reviews/Show', [
            'review' => $review->load(['reviewer', 'rental.equipment', 'rental.tenant', 'rental.owner']),
        ]);
    }

    public function hide(Review $review)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->reviewService->hideReview($review, $admin);

        return back()->with('success', 'Review hidden successfully.');
    }

    public function restore(Review $review)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->reviewService->restoreReview($review, $admin);

        return back()->with('success', 'Review restored successfully.');
    }

    public function destroy(Review $review)
    {
        $admin = Auth::guard('admin')->user();
        abort_unless($admin, 403);

        $this->reviewService->deleteReview($review, $admin);

        return back()->with('success', 'Review deleted permanently.');
    }
}
