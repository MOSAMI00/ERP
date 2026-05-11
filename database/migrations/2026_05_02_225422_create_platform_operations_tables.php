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
        | DISPUTES TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rental_op_id')
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->foreignId('equipment_handover_id')
                ->constrained('equipment_handover')
                ->cascadeOnDelete();

            $table->foreignId('raised_by_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->text('tenant_claim')->nullable();
            $table->text('owner_notes')->nullable();

            $table->decimal('requested_amount', 12, 2)->default(0);

            $table->enum('status', [
                'open',
                'under_review',
                'resolved'
            ])->default('open');

            $table->enum('admin_decision', [
                'accept_deduction',
                'reject_deduction',
                'modify_compensation'
            ])->nullable();

            $table->decimal('final_compensation', 12, 2)->nullable();

            $table->text('admin_note')->nullable();

            $table->foreignId('resolved_by_id')
                ->nullable()
                ->constrained('admins')
                ->nullOnDelete();

            $table->timestamp('resolved_at')->nullable();

            $table->timestamps();

            $table->unique('rental_op_id');
            $table->index(['status', 'resolved_at']);
        });

        /*
        |--------------------------------------------------------------------------
        | REVIEWS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('reviewer_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedBigInteger('target_id');

            $table->enum('target_type', [
                'user',
                'equipment'
            ]);

            $table->foreignId('rental_op_id')
                ->constrained('rental_operations')
                ->cascadeOnDelete();

            $table->decimal('rating', 3, 2);

            $table->text('review_text')->nullable();

            $table->enum('status', [
                'visible',
                'hidden',
                'deleted',
                'flagged'
            ])->default('visible');

            $table->foreignId('deleted_by_id')
                ->nullable()
                ->constrained('admins')
                ->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['reviewer_id', 'rental_op_id', 'target_type', 'target_id'], 'reviews_unique_reviewer_target_rental');
            $table->index(['target_type', 'target_id', 'status']);
        });

        /*
        |--------------------------------------------------------------------------
        | NOTIFICATIONS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('recipient_id');

            $table->enum('recipient_type', [
                'user',
                'admin'
            ]);

            $table->string('type');

            $table->string('title');
            $table->text('body');

            $table->string('reference_type')->nullable();
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->boolean('is_read')->default(false);

            $table->enum('priority', [
                'low',
                'medium',
                'high',
                'critical'
            ])->default('medium');

            $table->timestamp('read_at')->nullable();

            $table->timestamps();

            $table->index(['recipient_type', 'recipient_id', 'is_read']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('disputes');
    }
};
