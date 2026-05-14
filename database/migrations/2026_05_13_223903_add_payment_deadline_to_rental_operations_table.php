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
        Schema::table('rental_operations', function (Blueprint $table) {
            if (!Schema::hasColumn('rental_operations', 'payment_deadline')) {
                $table->timestamp('payment_deadline')->nullable()->after('cancellation_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_operations', function (Blueprint $table) {
            $table->dropColumn('payment_deadline');
        });
    }
};
