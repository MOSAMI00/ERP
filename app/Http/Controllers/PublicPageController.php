<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Equipment;
use App\Models\EquipmentAvailability;
use App\Models\RentalOperation;
use App\Models\Review;
use App\Shared\Settings\PlatformSettingsService;
use App\Support\EquipmentCardPresenter;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function __construct(
        private EquipmentCardPresenter $equipmentCards,
        private PlatformSettingsService $settings,
    ) {}

    public function policies(): Response
    {
        return Inertia::render('PoliciesPage');
    }

    public function home(Request $request): Response
    {
        $query = Equipment::with(['category', 'images', 'owner'])
            ->where('status', 'active');

        if ($request->filled('category') && $request->string('category')->toString() !== 'الكل') {
            $query->whereHas('category', fn ($categoryQuery) => $categoryQuery->where('name_ar', $request->category));
        }

        if ($request->filled('city') && $request->string('city')->toString() !== 'الكل') {
            $query->where('governorate', $request->city);
        }

        return Inertia::render('features/home/HomePage', [
            'products' => $query->latest()
                ->take(12)
                ->get()
                ->map(fn (Equipment $equipment) => $this->equipmentCards->present($equipment))
                ->values(),
            'categories' => Category::orderBy('sort_order')->get(),
            'cities' => Equipment::where('status', 'active')
                ->whereNotNull('governorate')
                ->distinct()
                ->pluck('governorate')
                ->values(),
            'filters' => $request->all(['category', 'city']),
        ]);
    }

    public function productIndex(): Response
    {
        return Inertia::render('features/product-details/ProductDetailPage');
    }

    public function productShow(int|string $id): Response
    {
        $equipment = Equipment::with(['category', 'images', 'owner'])
            ->where('status', 'active')
            ->findOrFail($id);

        $ownerReviews = Review::query()
            ->with(['reviewer:id,full_name,avatar', 'rental:id,equipment_id'])
            ->where('target_type', 'user')
            ->where('target_id', $equipment->owner_id)
            ->where('status', 'visible')
            ->latest()
            ->take(20)
            ->get()
            ->map(fn (Review $review) => [
                'id' => $review->id,
                'rating' => (float) $review->rating,
                'review_text' => $review->review_text,
                'created_at' => $review->created_at?->toDateString(),
                'reviewer' => [
                    'full_name' => $review->reviewer?->full_name,
                    'avatar' => $review->reviewer?->avatar,
                ],
                'operation' => [
                    'id' => $review->rental_op_id,
                    'equipment_id' => $review->rental?->equipment_id,
                ],
            ]);

        return Inertia::render('features/product-details/ProductDetailPage', [
            'product' => $this->equipmentCards->present($equipment),
            'platform_terms' => $this->settings->getPlatformTerms(),
            'owner_reviews' => [
                'average' => round((float) $ownerReviews->avg('rating'), 2),
                'count' => $ownerReviews->count(),
                'items' => $ownerReviews->values(),
            ],
        ]);
    }

    public function cart(Request $request): Response
    {
        $contractVariables = null;
        $cartItems = [];

        $equipment = $request->filled('equipment_id')
            ? Equipment::with(['owner', 'images', 'category'])->find($request->equipment_id)
            : null;

        if ($equipment && $request->user()) {
            $start = $request->start_date;
            $end = $request->end_date;
            $durationDays = 1;

            if ($start && $end) {
                $durationDays = max(1, Carbon::parse($start)->diffInDays(Carbon::parse($end)));
            }

            $rentalAmount = (float) $equipment->price_per_day * $durationDays;
            $primaryImage = $equipment->images->firstWhere('is_primary', true) ?? $equipment->images->first();

            $cartItems[] = [
                'id' => $equipment->id,
                'equipment_id' => $equipment->id,
                'name' => $equipment->name,
                'image' => $primaryImage?->image_url,
                'location' => $equipment->governorate,
                'owner' => $equipment->owner?->full_name,
                'startDate' => $start,
                'endDate' => $end,
                'days' => $durationDays,
                'dailyRate' => (float) $equipment->price_per_day,
                'deposit' => (float) $equipment->insurance_amount,
                'totalAmount' => $rentalAmount + (float) $equipment->insurance_amount,
            ];

            $contractVariables = [
                'rental_id' => 'بانتظار الإنشاء',
                'tenant_name' => $request->user()->full_name,
                'owner_name' => $equipment->owner?->full_name,
                'equipment_name' => $equipment->name,
                'rental_price' => number_format($rentalAmount, 2),
                'insurance_amount' => number_format((float) $equipment->insurance_amount, 2),
                'total_amount' => number_format($rentalAmount + (float) $equipment->insurance_amount, 2),
                'start_date' => $start,
                'end_date' => $end,
                'delivery_location' => 'يُحدد في خطوة بيانات التسليم',
                'preferred_time_slot' => 'يُحدد في خطوة بيانات التسليم',
            ];
        }

        return Inertia::render('features/cart/CartPage', [
            'cart_items' => $cartItems,
            'contract_template' => $this->settings->getContractTemplate(),
            'contract_variables' => $contractVariables,
        ]);
    }

    public function unavailableDates(int|string $id)
    {
        Equipment::findOrFail($id);

        $blocked = EquipmentAvailability::where('equipment_id', $id)
            ->get(['unavailable_from', 'unavailable_to', 'reason'])
            ->map(fn ($availability) => [
                'from' => $availability->unavailable_from?->format('Y-m-d'),
                'to' => $availability->unavailable_to?->format('Y-m-d'),
                'reason' => $availability->reason?->value ?? $availability->reason,
            ]);

        $rented = RentalOperation::where('equipment_id', $id)
            ->whereIn('status', ['confirmed', 'paid', 'in_use'])
            ->get(['start_date', 'end_date'])
            ->map(fn ($rental) => [
                'from' => $rental->start_date instanceof Carbon ? $rental->start_date->format('Y-m-d') : $rental->start_date,
                'to' => $rental->end_date instanceof Carbon ? $rental->end_date->format('Y-m-d') : $rental->end_date,
                'reason' => 'rented',
            ]);

        return response()->json([
            'unavailable' => $blocked->concat($rented)->values(),
        ]);
    }
}
