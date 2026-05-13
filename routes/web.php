<?php


use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentImageController;
use App\Http\Controllers\EquipmentAvailabilityController;
use App\Http\Controllers\RentalOperationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\HandoverReportController;
use App\Http\Controllers\EquipmentHandoverController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\KycDocumentController;
use App\Http\Controllers\UserPaymentMethodController;
use App\Http\Controllers\NotificationController;

use App\Http\Controllers\UserController;
use App\Models\Category as CategoryModel;
use App\Models\Contract as ContractModel;
use App\Models\Dispute as DisputeModel;
use App\Models\Equipment as EquipmentModel;
use App\Models\HandoverReport as HandoverReportModel;
use App\Models\Notification as NotificationModel;
use App\Models\Payment as PaymentModel;
use App\Models\RentalOperation as RentalOperationModel;
use App\Models\Review as ReviewModel;

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminKycController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminDisputeController;
use App\Http\Controllers\Admin\PlatformSettingController;
use App\Http\Controllers\Admin\AuditLogController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$equipmentCard = function (EquipmentModel $equipment): array {
    $primaryImage = $equipment->images->firstWhere('is_primary', true) ?? $equipment->images->first();

    return [
        'id' => $equipment->id,
        'name' => $equipment->name,
        'description' => $equipment->description,
        'category' => $equipment->category?->name_ar,
        'price' => (float) $equipment->price_per_day,
        'price_per_day' => (float) $equipment->price_per_day,
        'insurance' => (float) $equipment->insurance_amount,
        'insurance_amount' => (float) $equipment->insurance_amount,
        'location' => $equipment->governorate,
        'address' => $equipment->address,
        'status' => $equipment->status?->value ?? $equipment->status,
        'rating' => (float) $equipment->rating,
        'image' => $primaryImage?->image_url,
        'images' => $equipment->images->pluck('image_url')->values(),
        'owner' => $equipment->owner,
    ];
};

Route::get('/', function () use ($equipmentCard) {
    $products = EquipmentModel::with(['category', 'images', 'owner'])
        ->where('status', 'active')
        ->latest()
        ->take(12)
        ->get()
        ->map($equipmentCard)
        ->values();

    return Inertia::render('features/home/HomePage', [
        'products' => $products,
    ]);
})->name('home');

Route::get('/product', function () {
    return Inertia::render('features/product-details/ProductDetailPage');
})->name('product.index');

Route::get('/product/{id}', function ($id) use ($equipmentCard) {
    $equipment = EquipmentModel::with(['category', 'images', 'owner'])
        ->where('status', 'active')
        ->findOrFail($id);

    return Inertia::render('features/product-details/ProductDetailPage', [
        'product' => $equipmentCard($equipment),
    ]);
})->name('product.show');

Route::get('/cart', function () {
    return Inertia::render('features/cart/CartPage');
})->name('cart');

Route::middleware(['auth'])->group(function () {

    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', function () {
            $rentals = request()->user()->rentalsAsTenant()
                ->with(['equipment.images', 'equipment.owner', 'owner', 'contract', 'payments'])
                ->latest()
                ->get();

            return Inertia::render('Tenant/Orders/MyOrders/MyOrdersPage', ['rentals' => $rentals]);
        })->name('index');
        Route::get('/order/{id}', function ($id) {
            $rental = request()->user()->rentalsAsTenant()
                ->with(['equipment.images', 'owner', 'contract', 'payments', 'handoverReports', 'equipmentHandover'])
                ->findOrFail($id);

            return Inertia::render('Tenant/Orders/OrderDetails/OrderDetailsPage', [
                'rental' => $rental,
                'handover_reports' => $rental->handoverReports,
            ]);
        })->name('order');
        Route::get('/order/{id}/delivery', function ($id) {
            return redirect()->route('dashboard.delivery', ['id' => $id]);
        })->name('order.delivery');
        Route::get('/delivery', function () {
            $rentals = request()->user()->rentalsAsTenant()
                ->with(['equipment.images', 'equipmentHandover', 'tenant', 'owner'])
                ->latest()
                ->get();

            return Inertia::render('Tenant/Delivery/DeliveryPage', [
                'rentals' => $rentals,
                'handover_reports' => HandoverReportModel::whereIn('rental_op_id', $rentals->pluck('id'))->latest()->get(),
                'disputes' => DisputeModel::whereIn('rental_op_id', $rentals->pluck('id'))->latest()->get(),
            ]);
        })->name('delivery');
        Route::get('/contracts', function () {
            $rentalIds = request()->user()->rentalsAsTenant()->pluck('id');
            return Inertia::render('Tenant/Contracts/ContractsPage', [
                'contracts' => ContractModel::whereIn('rental_op_id', $rentalIds)->with('rental.equipment')->latest()->get(),
            ]);
        })->name('contracts');
        Route::get('/notifications', function () {
            return Inertia::render('Tenant/Notifications/NotificationsPage', [
                'notifications' => NotificationModel::where('recipient_type', 'user')->where('recipient_id', request()->user()->id)->latest()->get(),
            ]);
        })->name('notifications');
        Route::get('/ratings', function () {
            return Inertia::render('Tenant/Reviews/ReviewsPage', [
                'reviews' => ReviewModel::where('reviewer_id', request()->user()->id)->with('rental.equipment')->latest()->get(),
            ]);
        })->name('ratings');
        Route::get('/insurance', function () {
            $rentals = request()->user()->rentalsAsTenant()->with(['equipment', 'payments'])->latest()->get();
            return Inertia::render('Tenant/Insurance/InsurancePage', ['rentals' => $rentals]);
        })->name('insurance');
        Route::get('/settings', function () {
            return Inertia::render('Tenant/Settings/SettingsPage', [
                'kyc_documents' => request()->user()->kycDocuments()->latest()->get(),
                'payment_methods' => request()->user()->paymentMethods()->latest()->get(),
            ]);
        })->name('settings');
    });

    Route::prefix('owner')->name('owner.')->group(function () {
        Route::get('/', function () { return redirect()->route('owner.overview'); });
        Route::get('/overview', function () {
            $rentals = request()->user()->rentalsAsOwner()->with(['equipment', 'tenant', 'payments'])->latest()->get();
            return Inertia::render('Owner/Overview/OverviewPage', [
                'rentals' => $rentals,
                'stats' => [
                    'equipment_count' => request()->user()->equipment()->count(),
                    'pending_requests' => $rentals->where('status', 'pending')->count(),
                    'active_rentals' => $rentals->whereIn('status', ['confirmed', 'paid', 'in_use'])->count(),
                    'earnings' => (float) PaymentModel::whereIn('rental_op_id', $rentals->pluck('id'))->where('status', 'paid')->sum('amount'),
                ],
            ]);
        })->name('overview');
        Route::get('/equipment', function () { return Inertia::render('Owner/Equipment/EquipmentPage', ['equipment' => request()->user()->equipment()->with(['category', 'images'])->latest()->get()]); })->name('equipment');
        Route::get('/equipment/add', function () { return Inertia::render('Owner/AddEquipment/AddEquipmentPage', ['categories' => CategoryModel::orderBy('sort_order')->get()]); })->name('equipment.add');
        Route::get('/requests', function () { return Inertia::render('Owner/Requests/RequestsPage', ['rentals' => request()->user()->rentalsAsOwner()->with(['equipment.images', 'tenant'])->where('status', 'pending')->latest()->get()]); })->name('requests');
        Route::get('/rentals', function () { return Inertia::render('Owner/Rentals/RentalsPage', ['rentals' => request()->user()->rentalsAsOwner()->with(['equipment.images', 'tenant', 'contract', 'payments'])->latest()->get()]); })->name('rentals');
        Route::get('/delivery', function () {
            $rentals = request()->user()->rentalsAsOwner()->with(['equipment.images', 'equipmentHandover', 'tenant', 'owner'])->latest()->get();
            return Inertia::render('Owner/Delivery/DeliveryPage', [
                'rentals' => $rentals,
                'handover_reports' => HandoverReportModel::whereIn('rental_op_id', $rentals->pluck('id'))->latest()->get(),
                'disputes' => DisputeModel::whereIn('rental_op_id', $rentals->pluck('id'))->latest()->get(),
            ]);
        })->name('delivery');
        Route::get('/insurance', function () { return Inertia::render('Owner/Insurance/InsurancePage', ['rentals' => request()->user()->rentalsAsOwner()->with(['equipment', 'payments'])->latest()->get()]); })->name('insurance');
        Route::get('/earnings', function () {
            $rentalIds = request()->user()->rentalsAsOwner()->pluck('id');
            return Inertia::render('Owner/Earnings/EarningsPage', ['payments' => PaymentModel::whereIn('rental_op_id', $rentalIds)->with('rental.equipment')->latest()->get()]);
        })->name('earnings');
        Route::get('/contracts', function () {
            $rentalIds = request()->user()->rentalsAsOwner()->pluck('id');
            return Inertia::render('Owner/Contracts/ContractsPage', ['contracts' => ContractModel::whereIn('rental_op_id', $rentalIds)->with('rental.equipment')->latest()->get()]);
        })->name('contracts');
        Route::get('/notifications', function () { return Inertia::render('Owner/Notifications/NotificationsPage', ['notifications' => NotificationModel::where('recipient_type', 'user')->where('recipient_id', request()->user()->id)->latest()->get()]); })->name('notifications');
        Route::get('/reviews', function () { return Inertia::render('Owner/Reviews/ReviewsPage', ['reviews' => ReviewModel::whereIn('rental_op_id', request()->user()->rentalsAsOwner()->pluck('id'))->with(['reviewer', 'rental.equipment'])->latest()->get()]); })->name('reviews');
        Route::get('/profile', function () { return Inertia::render('Owner/Settings/SettingsPage', ['kyc_documents' => request()->user()->kycDocuments()->latest()->get(), 'payment_methods' => request()->user()->paymentMethods()->latest()->get()]); })->name('profile');
    });
});



require __DIR__.'/auth.php';

// ==========================================
// USER ROUTES (Requires Authentication)
// ==========================================
Route::middleware(['auth'])->group(function () {
    // User Profile (domain-specific)
    Route::get('user/profile', [UserController::class, 'profile'])->name('user.profile');
    Route::put('user/profile', [UserController::class, 'update'])->name('user.profile.update');
    // Categories & Equipment (Publicly viewable parts can be extracted if needed, but assuming auth for now)
    Route::resource('categories', CategoryController::class)->only(['index', 'show']);
    Route::resource('equipment', EquipmentController::class);

    // Equipment Add-ons
    Route::post('equipment/{equipment}/images', [EquipmentImageController::class, 'store'])->name('equipment.images.store');
    Route::patch('equipment/images/{image}/primary', [EquipmentImageController::class, 'setPrimary'])->name('equipment.images.setPrimary');
    Route::delete('equipment/images/{image}', [EquipmentImageController::class, 'destroy'])->name('equipment.images.destroy');

    Route::get('equipment/{equipment}/availability', [EquipmentAvailabilityController::class, 'index'])->name('equipment.availability.index');
    Route::post('equipment/{equipment}/availability', [EquipmentAvailabilityController::class, 'store'])->name('equipment.availability.store');
    Route::delete('equipment/availability/{availability}', [EquipmentAvailabilityController::class, 'destroy'])->name('equipment.availability.destroy');

    // Rentals
    Route::get('equipment/{equipment}/rent', [RentalOperationController::class, 'create'])->name('rentals.create');
    Route::resource('rentals', RentalOperationController::class)->only(['index', 'store', 'show']);
    Route::post('rentals/{rental}/confirm', [RentalOperationController::class, 'confirm'])->name('rentals.confirm');
    Route::post('rentals/{rental}/cancel', [RentalOperationController::class, 'cancel'])->name('rentals.cancel');

    // Payments
    Route::get('rentals/{rental}/pay', [PaymentController::class, 'create'])->name('payments.create');
    Route::resource('payments', PaymentController::class)->only(['index', 'store', 'show']);

    // Contracts
    Route::get('rentals/{rental}/contract', [ContractController::class, 'show'])->name('contracts.show');
    Route::post('contracts/{contract}/tenant-sign', [ContractController::class, 'tenantSign'])->name('contracts.tenantSign');
    Route::post('contracts/{contract}/owner-sign', [ContractController::class, 'ownerSign'])->name('contracts.ownerSign');

    // Handovers (Delivery / Return)
    Route::get('rentals/{rental}/handover-report', [HandoverReportController::class, 'create'])->name('handover-reports.create');
    Route::post('handover-reports', [HandoverReportController::class, 'store'])->name('handover-reports.store');
    Route::post('handover-reports/{report}/confirm', [HandoverReportController::class, 'confirm'])->name('handover-reports.confirm');

    // Equipment Handover & Compensation
    Route::get('rentals/{rental}/handover', [EquipmentHandoverController::class, 'show'])->name('equipment-handovers.show');
    Route::post('equipment-handovers/{handover}/decide', [EquipmentHandoverController::class, 'decide'])->name('equipment-handovers.decide');

    // Disputes
    Route::get('handovers/{handover}/dispute', [DisputeController::class, 'create'])->name('disputes.create');
    Route::resource('disputes', DisputeController::class)->only(['index', 'store', 'show']);

    // Reviews
    Route::get('rentals/{rental}/review', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('reviews', [ReviewController::class, 'store'])->name('reviews.store');

    // KYC
    Route::resource('kyc', KycDocumentController::class)->only(['index', 'create', 'store']);

    // User Payment Methods
    Route::resource('payment-methods', UserPaymentMethodController::class)->only(['index', 'store', 'destroy']);
    Route::patch('payment-methods/{method}/default', [UserPaymentMethodController::class, 'setDefault'])->name('payment-methods.setDefault');

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.markRead');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.markAllRead');
});

// ==========================================
// ADMIN ROUTES
// ==========================================
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');

    Route::middleware(['auth:admin'])->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        // Users
        Route::resource('users', AdminUserController::class)->only(['index', 'show']);
        Route::post('users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
        Route::post('users/{user}/ban', [AdminUserController::class, 'ban'])->name('users.ban');
        Route::post('users/{user}/activate', [AdminUserController::class, 'activate'])->name('users.activate');

        // KYC
        Route::resource('kyc', AdminKycController::class)->only(['index']);
        Route::post('kyc/{document}/approve', [AdminKycController::class, 'approve'])->name('kyc.approve');
        Route::post('kyc/{document}/reject', [AdminKycController::class, 'reject'])->name('kyc.reject');

        // Payments
        Route::resource('payments', AdminPaymentController::class)->only(['index', 'show']);
        Route::post('payments/{payment}/approve', [AdminPaymentController::class, 'approve'])->name('payments.approve');
        Route::post('payments/{payment}/reject', [AdminPaymentController::class, 'reject'])->name('payments.reject');
        Route::post('payments/{payment}/refund', [AdminPaymentController::class, 'refund'])->name('payments.refund');

        // Reviews
        Route::resource('reviews', AdminReviewController::class)->only(['index', 'show', 'destroy']);
        Route::post('reviews/{review}/hide', [AdminReviewController::class, 'hide'])->name('reviews.hide');
        Route::post('reviews/{review}/restore', [AdminReviewController::class, 'restore'])->name('reviews.restore');

        // Disputes
        Route::resource('disputes', AdminDisputeController::class)->only(['index', 'show']);
        Route::post('disputes/{dispute}/resolve', [AdminDisputeController::class, 'resolve'])->name('disputes.resolve');

        // Settings
        Route::get('settings', [PlatformSettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [PlatformSettingController::class, 'update'])->name('settings.update');

        // Audit Logs
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });
});
