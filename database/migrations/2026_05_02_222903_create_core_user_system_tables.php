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
        | USERS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone')->unique();

            $table->timestamp('email_verified_at')->nullable();

            $table->string('password_hash');
            $table->string('avatar')->nullable();

            $table->enum('type', ['tenant', 'owner']);

            $table->enum('status', [
                'active',
                'suspended',
                'banned'
            ])->default('active');

            $table->string('ban_reason')->nullable();

            $table->enum('kyc_status', [
                'pending',
                'verified',
                'rejected'
            ])->default('pending');

            $table->float('rating')->default(0);
            $table->integer('operations_count')->default(0);

            $table->string('governorate');

            // $table->rememberToken();

            $table->timestamps();
            $table->softDeletes();
        });

        /*
        |--------------------------------------------------------------------------
        | PASSWORD RESET TOKENS TABLE
        |--------------------------------------------------------------------------
        */
        // Schema::create('password_reset_tokens', function (Blueprint $table) {
        //     $table->string('email')->primary();
        //     $table->string('token');
        //     $table->timestamp('created_at')->nullable();
        // });

        /*
        |--------------------------------------------------------------------------
        | SESSIONS TABLE
        |--------------------------------------------------------------------------
        */
        // Schema::create('sessions', function (Blueprint $table) {
        //     $table->string('id')->primary();

        //     $table->foreignId('user_id')
        //         ->nullable()
        //         ->constrained('users')
        //         ->nullOnDelete()
        //         ->index();

        //     $table->string('ip_address', 45)->nullable();
        //     $table->text('user_agent')->nullable();

        //     $table->longText('payload');

        //     $table->integer('last_activity')->index();
        // });

        /*
        |--------------------------------------------------------------------------
        | KYC DOCUMENTS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('kyc_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('doc_type', [
                'national_id',
                'passport',
                'military_id'
            ]);

            $table->string('front_url');
            $table->string('back_url')->nullable();

            $table->enum('status', [
                'pending',
                'approved',
                'rejected'
            ])->default('pending');

            $table->unsignedBigInteger('reviewed_by')->nullable();

            $table->timestamp('submitted_at');

            $table->timestamps();
        });

        /*
        |--------------------------------------------------------------------------
        | USER PAYMENT METHODS TABLE
        |--------------------------------------------------------------------------
        */
        Schema::create('user_payment_methods', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('type', [
                'bank_account',
                'e_wallet'
            ]);

            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();

            $table->string('wallet_number')->nullable();

            $table->string('token_ref')->nullable();

            $table->boolean('is_default')->default(false);
            $table->boolean('is_verified')->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_payment_methods');
        Schema::dropIfExists('kyc_documents');
        // Schema::dropIfExists('sessions');
        // Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};