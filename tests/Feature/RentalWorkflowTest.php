<?php

use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

it('completes a full happy path rental workflow', function () {
    // 1. Setup
    $owner = User::factory()->create(['type' => 'owner']);
    $tenant = User::factory()->create(['type' => 'tenant']);
    
    $equipment = Equipment::factory()->create([
        'owner_id' => $owner->id,
        'price_per_day' => 100,
        'insurance_amount' => 500,
    ]);

    // 2. Tenant creates rental request
    $start = Carbon::tomorrow();
    $end = Carbon::tomorrow()->addDays(5);
    
    $response = $this->actingAs($tenant)->post(route('rentals.store'), [
        'equipment_id' => $equipment->id,
        'start_date' => $start->format('Y-m-d'),
        'end_date' => $end->format('Y-m-d'),
        'delivery_location' => '123 Main St',
    ]);

    $response->assertSessionHasNoErrors();
    $rental = RentalOperation::first();
    
    expect($rental->status)->toBe(RentalStatus::Pending->value)
        ->and($rental->tenant_id)->toBe($tenant->id)
        ->and($rental->owner_id)->toBe($owner->id);

    // 3. Owner confirms rental
    $this->actingAs($owner)->post(route('rentals.confirm', $rental->id));
    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Confirmed->value);

    // 4. Tenant pays
    $this->actingAs($tenant)->post(route('payments.store'), [
        'rental_op_id' => $rental->id,
        'payment_method' => 'bank_transfer',
    ]);
    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Paid->value);
    
    // Admin approves payment (offline)
    $payment = $rental->payments()->first();
    $admin = \App\Models\Admin::factory()->create();
    $this->actingAs($admin, 'admin')->post(route('admin.payments.approve', $payment->id));
    
    $payment->refresh();
    expect($payment->status)->toBe(PaymentStatus::Paid->value);

    // 5. Tenant uploads signed contract
    // We assume the offline contract signing was done. 
    $contract = $rental->contract()->create([
        'tenant_id' => $tenant->id,
        'owner_id' => $owner->id,
        'contract_file_path' => 'fake_path.pdf',
        'status' => 'signed',
        'signed_at' => now(),
    ]);

    // 6. Delivery Handover (Tenant)
    $this->actingAs($tenant)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'delivery',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'All good',
    ]);
    
    $deliveryReport = $rental->handoverReports()->where('phase', 'delivery')->first();
    
    // Owner confirms delivery
    $this->actingAs($owner)->post(route('handover-reports.confirm', $deliveryReport->id));
    
    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Active->value);

    // 7. Return Handover (Tenant returns)
    $this->actingAs($tenant)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'return',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'Returned successfully',
    ]);
    
    $returnReport = $rental->handoverReports()->where('phase', 'return')->first();

    // Owner confirms return
    $this->actingAs($owner)->post(route('handover-reports.confirm', $returnReport->id));

    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Completed->value);
});
