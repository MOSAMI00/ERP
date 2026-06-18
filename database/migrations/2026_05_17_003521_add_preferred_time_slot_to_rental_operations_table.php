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
            $table->string('preferred_time_slot')->nullable()->after('delivery_location');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_operations', function (Blueprint $table) {
            $table->dropColumn('preferred_time_slot');
        });
    }
};
