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
        | ADMIN ROLES TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('admin_roles', function (Blueprint $table) {
            $table->id();

            $table->enum('role_name', [
                'super_admin',
                'support',
                'finance'
            ])->unique();

            $table->boolean('can_manage_users')->default(false);
            $table->boolean('can_manage_equipment')->default(false);
            $table->boolean('can_manage_rentals')->default(false);
            $table->boolean('can_manage_disputes')->default(false);
            $table->boolean('can_manage_financial')->default(false);
            $table->boolean('can_manage_reviews')->default(false);
            $table->boolean('can_view_audit_log')->default(false);
            $table->boolean('can_manage_settings')->default(false);

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | ADMINS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('admins', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('email')->unique();
            $table->string('password_hash');

            $table->foreignId('role_id')
                ->constrained('admin_roles')
                ->cascadeOnDelete();

            $table->enum('status', [
                'active',
                'suspended'
            ])->default('active');

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | PLATFORM SETTINGS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();

            $table->decimal('platform_fee_rate', 5, 2)->default(0);

            $table->integer('min_rental_days')->default(1);
            $table->integer('max_rental_days')->default(365);

            $table->integer('objection_window_hours')->default(24);
            $table->integer('refund_window_days')->default(7);

            $table->boolean('kyc_required')->default(true);

            $table->unsignedBigInteger('updated_by')->nullable();

            $table->timestamp('updated_at')->nullable();
        });

        /*
        |--------------------------------------------------------------------------
        | AUDIT LOGS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('admin_id')
                ->constrained('admins')
                ->cascadeOnDelete();

            $table->string('admin_role');

            $table->enum('event_type', [
                'ban',
                'content_delete',
                'dispute_decision',
                'edit',
                'financial_action',
                'suspend',
                'warn'
            ]);

            $table->string('target_type');
            $table->unsignedBigInteger('target_id');

            $table->text('details')->nullable();

            $table->string('ip_address')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('platform_settings');
        Schema::dropIfExists('admins');
        Schema::dropIfExists('admin_roles');
    }
};