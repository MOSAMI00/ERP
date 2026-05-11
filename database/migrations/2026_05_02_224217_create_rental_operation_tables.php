<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        /*
        |--------------------------------------------------------------------------
        | RENTAL OPERATIONS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('rental_operations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('tenant_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('owner_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('equipment_id')
                ->constrained('equipment')
                ->cascadeOnDelete();

            $table->date('start_date');
            $table->date('end_date');

            $table->integer('duration_days');

            $table->decimal('rental_amount', 12, 2);
            $table->decimal('insurance_amount', 12, 2);
            $table->decimal('total_amount', 12, 2);

            $table->enum('status', [
                'pending',
                'confirmed',
                'in_use',
                'completed',
                'cancelled',
                'disputed'
            ])->default('pending');

            $table->string('cancellation_reason')->nullable();

            $table->string('delivery_location');

            $table->timestamp('delivery_time')->nullable();
            $table->timestamp('delivery_confirmed_at')->nullable();
            $table->timestamp('return_confirmed_at')->nullable();

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | CONTRACTS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_op_id')
                ->unique()
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->longText('contract_body');

            $table->enum('tenant_signature', [
                'pending',
                'signed'
            ])->default('pending');

            $table->enum('owner_signature', [
                'pending',
                'signed'
            ])->default('pending');

            $table->timestamp('tenant_signed_at')->nullable();
            $table->timestamp('owner_signed_at')->nullable();

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | PAYMENTS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_op_id')
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->enum('type', [
                'rental',
                'insurance',
                'insurance_refund',
                'owner_transfer',
                'compensation'
            ]);

            $table->decimal('amount', 12, 2);

            $table->decimal('platform_fee', 12, 2)->default(0);

            $table->enum('status', [
                'pending',
                'processing',
                'paid',
                'stopped',
                'refunded'
            ])->default('pending');

            $table->string('payment_method')->nullable();
            $table->string('transaction_ref')->nullable();

            $table->enum('escrow_status', [
                'held',
                'released',
                'refunded'
            ])->default('held');

            $table->string('stop_reason')->nullable();

            $table->foreignId('stopped_by_id')
                ->nullable()
                ->constrained('admins')
                ->nullOnDelete();

            $table->timestamp('paid_at')->nullable();
            $table->timestamp('transferred_at')->nullable();
            $table->timestamp('refunded_at')->nullable();   // ✦ جديد
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('contracts');
        Schema::dropIfExists('rental_operations');
    }
};
