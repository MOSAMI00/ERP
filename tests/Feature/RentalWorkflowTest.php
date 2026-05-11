<?php

use App\Domains\Payment\Enums\PaymentStatus;
use App\Domains\Rental\Enums\RentalStatus;
use App\Models\Equipment;
use App\Models\RentalOperation;
use App\Models\User;
use Carbon\Carbon;

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
    
    expect($rental)->not->toBeNull();
    expect($rental->status)->toBe(RentalStatus::Pending)
        ->and($rental->tenant_id)->toBe($tenant->id)
        ->and($rental->owner_id)->toBe($owner->id);

    // 3. Owner confirms rental
    $this->actingAs($owner)->post(route('rentals.confirm', $rental->id));
    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Confirmed);

    // 4. Tenant pays
    $this->actingAs($tenant)->post(route('payments.store'), [
        'rental_op_id' => $rental->id,
        'payment_method' => 'bank_transfer',
    ]);
    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Paid);

    // 5. Payment exists and was processed through workflow
    $payment = $rental->payments()->first();
    expect($payment)->not->toBeNull()
        ->and($payment->status)->toBe(PaymentStatus::Paid->value);

    // 6. Delivery Handover — Owner submits first
    $this->actingAs($owner)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'delivery',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'Equipment delivered',
    ]);

    // Tenant submits delivery report — this triggers Paid → InUse transition via workflow
    $this->actingAs($tenant)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'delivery',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'Equipment received in good condition',
    ]);

    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::InUse);

    // 7. Return Handover — Tenant submits first
    $this->actingAs($tenant)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'return',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'Equipment returned',
    ]);

    // Owner submits return report — triggers return_confirmed_at via workflow
    $this->actingAs($owner)->post(route('handover-reports.store'), [
        'rental_op_id' => $rental->id,
        'phase' => 'return',
        'has_issues' => false,
        'condition_status' => 'good',
        'notes' => 'Equipment received back in good condition',
    ]);

    $rental->refresh();
    expect($rental->return_confirmed_at)->not->toBeNull();
});

it('prevents duplicate payments for the same rental', function () {
    $owner = User::factory()->create(['type' => 'owner']);
    $tenant = User::factory()->create(['type' => 'tenant']);
    $equipment = Equipment::factory()->create(['owner_id' => $owner->id]);

    // Create and confirm rental
    $this->actingAs($tenant)->post(route('rentals.store'), [
        'equipment_id' => $equipment->id,
        'start_date' => Carbon::tomorrow()->format('Y-m-d'),
        'end_date' => Carbon::tomorrow()->addDays(3)->format('Y-m-d'),
        'delivery_location' => 'Test location',
    ]);

    $rental = RentalOperation::first();
    $this->actingAs($owner)->post(route('rentals.confirm', $rental->id));
    
    // First payment
    $this->actingAs($tenant)->post(route('payments.store'), [
        'rental_op_id' => $rental->id,
        'payment_method' => 'bank_transfer',
    ]);

    // Second payment attempt — should be idempotent (returns existing)
    $this->actingAs($tenant)->post(route('payments.store'), [
        'rental_op_id' => $rental->id,
        'payment_method' => 'bank_transfer',
    ]);

    // Should only have 1 rental payment
    expect($rental->payments()->count())->toBe(1);
});

it('prevents cancellation of a rental that is already active', function () {
    $owner = User::factory()->create(['type' => 'owner']);
    $tenant = User::factory()->create(['type' => 'tenant']);
    $equipment = Equipment::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($tenant)->post(route('rentals.store'), [
        'equipment_id' => $equipment->id,
        'start_date' => Carbon::tomorrow()->format('Y-m-d'),
        'end_date' => Carbon::tomorrow()->addDays(3)->format('Y-m-d'),
        'delivery_location' => 'Test location',
    ]);

    $rental = RentalOperation::first();
    // Confirm and pay
    $this->actingAs($owner)->post(route('rentals.confirm', $rental->id));
    $this->actingAs($tenant)->post(route('payments.store'), [
        'rental_op_id' => $rental->id,
        'payment_method' => 'bank_transfer',
    ]);

    $rental->refresh();
    expect($rental->status)->toBe(RentalStatus::Paid);

    // Attempting to cancel a Paid rental should fail (only Pending/Confirmed are cancellable)
    $response = $this->actingAs($tenant)->post(route('rentals.cancel', $rental->id), [
        'cancellation_reason' => 'Changed my mind',
    ]);

    $rental->refresh();
    // Status should still be Paid — the workflow guard should have rejected this
    expect($rental->status)->toBe(RentalStatus::Paid);
});
