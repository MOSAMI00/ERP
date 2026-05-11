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
        | HANDOVER REPORTS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('handover_reports', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_op_id')
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->enum('phase', [
                'delivery',
                'return'
            ]);

            $table->foreignId('submitted_by_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('submitted_by_role', [
                'tenant',
                'owner'
            ]);

            $table->text('notes')->nullable();

            $table->boolean('has_issues')->default(false);

            $table->enum('condition_status', [
                'good',
                'damaged',
                'partially_damaged'
            ])->default('good');

            $table->foreignId('confirmed_by_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('confirmed_by_role', [
                'tenant',
                'owner'
            ])->nullable();

            $table->timestamp('confirmed_at')->nullable();

            $table->timestamps();

            $table->unique(['rental_op_id', 'phase', 'submitted_by_id'], 'handover_unique_submitter_phase');
            $table->index(['rental_op_id', 'phase']);
        });

        /*
        |--------------------------------------------------------------------------
        | HANDOVER IMAGES TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('handover_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('handover_report_id')
                ->constrained('handover_reports')
                ->cascadeOnDelete();

            $table->string('image_url');

            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['rental_op_id', 'owner_decision']);
            $table->index('objection_deadline');
        });

        /*
        |--------------------------------------------------------------------------
        | EQUIPMENT HANDOVER TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('equipment_handover', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_op_id')
                ->unique()
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->date('actual_return_date')->nullable();

            $table->integer('actual_rental_days')->nullable();

            $table->decimal('late_fee', 12, 2)->default(0);

            $table->enum('final_condition', [
                'good',
                'damaged',
                'partially_damaged'
            ])->default('good');

            $table->text('final_notes')->nullable();

            $table->decimal('proposed_deduction', 12, 2)->default(0);

            $table->enum('owner_decision', [
                'full_refund',
                'partial_refund',
                'no_refund'
            ])->nullable();

            $table->foreignId('decided_by_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->timestamp('decided_at')->nullable();

            $table->timestamp('objection_deadline')->nullable();
            $table->timestamp('objection_submitted_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_handover');
        Schema::dropIfExists('handover_images');
        Schema::dropIfExists('handover_reports');
    }
};
