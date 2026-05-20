<?php

use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminDisputeController;
use App\Http\Controllers\Admin\AdminEquipmentController;
use App\Http\Controllers\Admin\AdminKycController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminRentalController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\PlatformSettingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DisputeController;
use App\Http\Controllers\EquipmentAvailabilityController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentHandoverController;
use App\Http\Controllers\EquipmentImageController;
use App\Http\Controllers\HandoverReportController;
use App\Http\Controllers\KycDocumentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OwnerDashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PublicPageController;
use App\Http\Controllers\RentalOperationController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TenantDashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserPaymentMethodController;
use Illuminate\Support\Facades\Route;

Route::get('/policies', [PublicPageController::class, 'policies']);
Route::get('/', [PublicPageController::class, 'home'])->name('home');
Route::get('/product', [PublicPageController::class, 'productIndex'])->name('product.index');
Route::get('/product/{id}', [PublicPageController::class, 'productShow'])->name('product.show');
Route::get('/cart', [PublicPageController::class, 'cart'])->name('cart');
Route::get('/product/{id}/unavailable-dates', [PublicPageController::class, 'unavailableDates'])->name('product.unavailable-dates');

Route::middleware(['auth', 'active'])->group(function () {
    Route::prefix('dashboard')->name('dashboard.')->group(function () {
        Route::get('/', [TenantDashboardController::class, 'index'])->name('index');
        Route::get('/order/{id}', [TenantDashboardController::class, 'order'])->name('order');
        Route::get('/order/{id}/delivery', [TenantDashboardController::class, 'orderDelivery'])->name('order.delivery');
        Route::get('/delivery', [TenantDashboardController::class, 'delivery'])->name('delivery');
        Route::get('/contracts', [TenantDashboardController::class, 'contracts'])->name('contracts');
        Route::get('/notifications', [TenantDashboardController::class, 'notifications'])->name('notifications');
        Route::get('/ratings', [TenantDashboardController::class, 'ratings'])->name('ratings');
        Route::get('/insurance', [TenantDashboardController::class, 'insurance'])->name('insurance');
        Route::get('/settings', [TenantDashboardController::class, 'settings'])->name('settings');
    });

    Route::prefix('owner')->name('owner.')->group(function () {
        Route::get('/', [OwnerDashboardController::class, 'root']);
        Route::get('/overview', [OwnerDashboardController::class, 'overview'])->name('overview');
        Route::get('/equipment', [OwnerDashboardController::class, 'equipment'])->name('equipment');
        Route::get('/equipment/add', [OwnerDashboardController::class, 'addEquipment'])->name('equipment.add');
        Route::get('/equipment/{equipment}/edit', [OwnerDashboardController::class, 'editEquipment'])->name('equipment.edit');
        Route::get('/requests', [OwnerDashboardController::class, 'requests'])->name('requests');
        Route::get('/rentals', [OwnerDashboardController::class, 'rentals'])->name('rentals');
        Route::get('/delivery', [OwnerDashboardController::class, 'delivery'])->name('delivery');
        Route::get('/insurance', [OwnerDashboardController::class, 'insurance'])->name('insurance');
        Route::get('/earnings', [OwnerDashboardController::class, 'earnings'])->name('earnings');
        Route::get('/contracts', [OwnerDashboardController::class, 'contracts'])->name('contracts');
        Route::get('/notifications', [OwnerDashboardController::class, 'notifications'])->name('notifications');
        Route::get('/reviews', [OwnerDashboardController::class, 'reviews'])->name('reviews');
        Route::get('/profile', [OwnerDashboardController::class, 'profile'])->name('profile');
    });
});

require __DIR__ . '/auth.php';

Route::middleware(['auth', 'active'])->group(function () {
    Route::get('user/profile', [UserController::class, 'profile'])->name('user.profile');
    Route::put('user/profile', [UserController::class, 'update'])->name('user.profile.update');

    Route::resource('categories', CategoryController::class)->only(['index', 'show']);
    Route::get('equipment/{equipment}/check-availability', [EquipmentController::class, 'checkAvailability']);
    Route::get('equipment', [EquipmentController::class, 'index'])->name('equipment.index');
    Route::get('equipment/{equipment}', [EquipmentController::class, 'show'])->name('equipment.show');

    Route::middleware(['kyc'])->group(function () {
        Route::get('equipment/create', [EquipmentController::class, 'create'])->name('equipment.create');
        Route::post('equipment', [EquipmentController::class, 'store'])->name('equipment.store');
        Route::get('equipment/{equipment}/edit', [EquipmentController::class, 'edit'])->name('equipment.edit');
        Route::put('equipment/{equipment}', [EquipmentController::class, 'update'])->name('equipment.update');
        Route::patch('equipment/{equipment}', [EquipmentController::class, 'update']);
        Route::delete('equipment/{equipment}', [EquipmentController::class, 'destroy'])->name('equipment.destroy');

        Route::post('equipment/{equipment}/images', [EquipmentImageController::class, 'store'])->name('equipment.images.store');
        Route::patch('equipment/images/{image}/primary', [EquipmentImageController::class, 'setPrimary'])->name('equipment.images.setPrimary');
        Route::delete('equipment/images/{image}', [EquipmentImageController::class, 'destroy'])->name('equipment.images.destroy');

        Route::get('equipment/{equipment}/availability', [EquipmentAvailabilityController::class, 'index'])->name('equipment.availability.index');
        Route::post('equipment/{equipment}/availability', [EquipmentAvailabilityController::class, 'store'])->name('equipment.availability.store');
        Route::delete('equipment/availability/{availability}', [EquipmentAvailabilityController::class, 'destroy'])->name('equipment.availability.destroy');

        Route::get('equipment/{equipment}/rent', [RentalOperationController::class, 'create'])->name('rentals.create');
        Route::post('rentals/{rental}/confirm', [RentalOperationController::class, 'confirm'])->name('rentals.confirm');
        Route::post('rentals/{rental}/cancel', [RentalOperationController::class, 'cancel'])->name('rentals.cancel');
        Route::resource('rentals', RentalOperationController::class)->only(['store']);

        Route::get('rentals/{rental}/pay', [PaymentController::class, 'create'])->name('payments.create');
        Route::resource('payments', PaymentController::class)->only(['store']);

        Route::post('contracts/{contract}/tenant-sign', [ContractController::class, 'tenantSign'])->name('contracts.tenantSign');
        Route::post('contracts/{contract}/owner-sign', [ContractController::class, 'ownerSign'])->name('contracts.ownerSign');
    });

    Route::resource('rentals', RentalOperationController::class)->only(['index', 'show']);
    Route::resource('payments', PaymentController::class)->only(['index', 'show']);
    Route::get('rentals/{rental}/contract', [ContractController::class, 'show'])->name('contracts.show');

    Route::get('rentals/{rental}/handover-report', [HandoverReportController::class, 'create'])->name('handover-reports.create');
    Route::post('handover-reports', [HandoverReportController::class, 'store'])->name('handover-reports.store');
    Route::post('handover-reports/{report}/confirm', [HandoverReportController::class, 'confirm'])->name('handover-reports.confirm');

    Route::get('rentals/{rental}/handover', [EquipmentHandoverController::class, 'show'])->name('equipment-handovers.show');
    Route::post('equipment-handovers/{handover}/decide', [EquipmentHandoverController::class, 'decide'])->name('equipment-handovers.decide');
    Route::post('equipment-handovers/{handover}/respond', [EquipmentHandoverController::class, 'respond'])->name('equipment-handovers.respond');

    Route::get('handovers/{handover}/dispute', [DisputeController::class, 'create'])->name('disputes.create');
    Route::resource('disputes', DisputeController::class)->only(['index', 'store', 'show']);

    Route::get('rentals/{rental}/review', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('reviews', [ReviewController::class, 'store'])->name('reviews.store');

    Route::resource('kyc', KycDocumentController::class)->only(['index', 'create', 'store']);

    Route::resource('payment-methods', UserPaymentMethodController::class)->only(['index', 'store', 'destroy']);
    Route::patch('payment-methods/{method}/default', [UserPaymentMethodController::class, 'setDefault'])->name('payment-methods.setDefault');

    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.markRead');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.markAllRead');
});

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login'])->name('login.submit');
    Route::post('logout', [AdminAuthController::class, 'logout'])->name('logout');

    Route::middleware(['auth:admin'])->group(function () {
        Route::get('dashboard', AdminDashboardController::class)->name('dashboard');

        Route::resource('users', AdminUserController::class)->only(['index', 'show']);
        Route::post('users/{user}/suspend', [AdminUserController::class, 'suspend'])->name('users.suspend');
        Route::post('users/{user}/ban', [AdminUserController::class, 'ban'])->name('users.ban');
        Route::post('users/{user}/activate', [AdminUserController::class, 'activate'])->name('users.activate');

        Route::get('equipment', [AdminEquipmentController::class, 'index'])->name('equipment.index');
        Route::post('equipment/{equipment}/toggle-visibility', [AdminEquipmentController::class, 'toggleVisibility'])->name('equipment.toggle-visibility');
        Route::delete('equipment/{equipment}', [AdminEquipmentController::class, 'destroy'])->name('equipment.destroy');
        Route::get('rentals', [AdminRentalController::class, 'index'])->name('rentals.index');

        Route::resource('kyc', AdminKycController::class)->only(['index']);
        Route::post('kyc/{document}/approve', [AdminKycController::class, 'approve'])->name('kyc.approve');
        Route::post('kyc/{document}/reject', [AdminKycController::class, 'reject'])->name('kyc.reject');

        Route::resource('payments', AdminPaymentController::class)->only(['index', 'show']);
        Route::post('payments/{payment}/approve', [AdminPaymentController::class, 'approve'])->name('payments.approve');
        Route::post('payments/{payment}/reject', [AdminPaymentController::class, 'reject'])->name('payments.reject');
        Route::post('payments/{payment}/refund', [AdminPaymentController::class, 'refund'])->name('payments.refund');

        Route::resource('reviews', AdminReviewController::class)->only(['index', 'show', 'destroy']);
        Route::post('reviews/{review}/hide', [AdminReviewController::class, 'hide'])->name('reviews.hide');
        Route::post('reviews/{review}/restore', [AdminReviewController::class, 'restore'])->name('reviews.restore');

        Route::resource('disputes', AdminDisputeController::class)->only(['index', 'show']);
        Route::post('disputes/{dispute}/resolve', [AdminDisputeController::class, 'resolve'])->name('disputes.resolve');

        Route::get('settings', [PlatformSettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [PlatformSettingController::class, 'update'])->name('settings.update');

        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
    });
});
