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
        | CATEGORIES TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('categories', function (Blueprint $table) {
            $table->id();

            $table->string('name_ar');
            $table->string('icon')->nullable();
            $table->string('slug')->unique();

            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('categories')
                ->nullOnDelete();

            $table->integer('sort_order')->default(0);

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | EQUIPMENT TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('equipment', function (Blueprint $table) {
            $table->id();

            $table->foreignId('owner_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('category_id')
                ->constrained('categories')
                ->cascadeOnDelete();

            $table->string('name');
            $table->text('description');

            $table->string('governorate');
            $table->string('address');

            $table->decimal('price_per_day', 12, 2);
            $table->decimal('insurance_amount', 12, 2);

            $table->text('rental_terms');

            $table->enum('status', [
                'active',
                'hidden',
                'deleted'
            ])->default('active');

            $table->float('rating')->default(0);
            $table->integer('rentals_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['owner_id', 'status']);
            $table->index(['category_id', 'status']);
            $table->index('governorate');
        });

        /*
        |--------------------------------------------------------------------------
        | EQUIPMENT IMAGES TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('equipment_images', function (Blueprint $table) {
            $table->id();

            $table->foreignId('equipment_id')
                ->constrained('equipment')
                ->cascadeOnDelete();

            $table->string('image_url');

            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);

            $table->timestamps();

            $table->index(['equipment_id', 'sort_order']);
        });

        /*
        |--------------------------------------------------------------------------
        | EQUIPMENT AVAILABILITY TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('equipment_availability', function (Blueprint $table) {
            $table->id();

            $table->foreignId('equipment_id')
                ->constrained('equipment')
                ->cascadeOnDelete();

            $table->date('unavailable_from');
            $table->date('unavailable_to');

            $table->enum('reason', [
                'booked',
                'owner_blocked'
            ]);

            $table->timestamps();

            $table->index(
                ['equipment_id', 'unavailable_from', 'unavailable_to'],
                'equipment_availability_period'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipment_availability');
        Schema::dropIfExists('equipment_images');
        Schema::dropIfExists('equipment');
        Schema::dropIfExists('categories');
    }
};
