<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
