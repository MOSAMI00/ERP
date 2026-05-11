<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
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
        $review->update([
            'status'      => 'hidden',
            'deleted_by_id' => Auth::guard('admin')->id() ?? Auth::id(),
        ]);

        // إعادة حساب التقييم بعد الإخفاء
        $this->recalculateRating($review->target_type, $review->target_id);

        return back()->with('success', 'Review hidden successfully.');
    }

    public function restore(Review $review)
    {
        $review->update([
            'status' => 'visible',
            'deleted_by_id' => null,
        ]);

        $this->recalculateRating($review->target_type, $review->target_id);

        return back()->with('success', 'Review restored successfully.');
    }

    public function destroy(Review $review)
    {
        $targetType = $review->target_type;
        $targetId = $review->target_id;
        $review->delete();
        $this->recalculateRating($targetType, $targetId);

        return back()->with('success', 'Review deleted permanently.');
    }

    private function recalculateRating(string $type, int $id): void
    {
        $avg = Review::where('target_type', $type)
            ->where('target_id', $id)
            ->where('status', 'visible')
            ->avg('rating');

        $newRating = $avg ? round($avg, 2) : 0;

        if ($type === 'user') {
            \App\Models\User::find($id)?->update(['rating' => $newRating]);
        } else {
            \App\Models\Equipment::find($id)?->update(['rating' => $newRating]);
        }
    }
}
