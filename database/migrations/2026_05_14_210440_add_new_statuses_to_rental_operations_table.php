<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE rental_operations MODIFY COLUMN status ENUM('pending', 'confirmed', 'paid', 'in_use', 'return_done', 'compensation_requested', 'completed', 'cancelled', 'disputed') NOT NULL DEFAULT 'pending'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE rental_operations MODIFY COLUMN status ENUM('pending', 'confirmed', 'paid', 'in_use', 'completed', 'cancelled', 'disputed') NOT NULL DEFAULT 'pending'");
    }
};
