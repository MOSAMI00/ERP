<?php

namespace App\Http\Controllers\Admin;

use App\Domains\Payment\Enums\EscrowStatus;
use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Http\Controllers\Controller;
use App\Models\Dispute;
use App\Models\Payment;
use App\Models\RentalOperation;
use App\Models\Review;
use App\Models\User;
use Carbon\CarbonPeriod;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function __invoke()
    {
        $from = now()->subDays(29)->startOfDay();
        $rentalsByDay = RentalOperation::query()
            ->where('created_at', '>=', $from)
            ->get()
            ->groupBy(fn ($rental) => $rental->created_at->format('Y-m-d'));

        $lineData = collect(CarbonPeriod::create($from, now()->startOfDay()))
            ->map(function ($date) use ($rentalsByDay) {
                $rows = $rentalsByDay->get($date->format('Y-m-d'), collect());

                return [
                    'name' => $date->format('m/d'),
                    'completed' => $rows->where('status', RentalStatus::Completed)->count(),
                    'cancelled' => $rows->where('status', RentalStatus::Cancelled)->count(),
                    'created' => $rows->count(),
                ];
            })
            ->values();

        $statusCounts = RentalOperation::selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'rentals_count' => RentalOperation::count(),
                'profits' => (float) Payment::where('status', PaymentStatus::Paid->value)->sum('platform_fee'),
                'open_disputes' => Dispute::whereIn('status', ['open', 'under_review'])->count(),
                'users_count' => User::count(),
                'cancel_rate' => $this->rate(
                    RentalOperation::where('status', RentalStatus::Cancelled->value)->count(),
                    RentalOperation::count(),
                ),
                'dispute_rate' => $this->rate(Dispute::count(), RentalOperation::count()),
                'escrow_held' => (float) Payment::where('escrow_status', EscrowStatus::Held->value)->sum('amount'),
            ],
            'lineData' => $lineData,
            'pieData' => [
                ['name' => 'مكتملة', 'value' => (int) ($statusCounts[RentalStatus::Completed->value] ?? 0), 'color' => '#27AE60'],
                ['name' => 'قيد الاستخدام', 'value' => (int) ($statusCounts[RentalStatus::InUse->value] ?? 0), 'color' => '#3498DB'],
                ['name' => 'قيد المراجعة', 'value' => (int) ($statusCounts[RentalStatus::Pending->value] ?? 0), 'color' => '#F39C12'],
                ['name' => 'ملغاة/نزاع', 'value' => (int) (($statusCounts[RentalStatus::Cancelled->value] ?? 0) + ($statusCounts[RentalStatus::Disputed->value] ?? 0)), 'color' => '#E74C3C'],
            ],
            'recentDisputes' => Dispute::with(['rental.equipment', 'rental.tenant', 'rental.owner'])
                ->latest()
                ->take(5)
                ->get(),
            'recentReports' => Review::with(['reviewer', 'rental.equipment'])
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    private function rate(int $part, int $total): float
    {
        if ($total === 0) {
            return 0;
        }

        return round(($part / $total) * 100, 1);
    }
}
