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
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        // Adding 'excellent' and 'fair' to the enum
        DB::statement("ALTER TABLE handover_reports MODIFY COLUMN condition_status ENUM('excellent', 'good', 'fair', 'damaged', 'partially_damaged') NOT NULL DEFAULT 'good'");
        
        // Also updating equipment_handover table which has a similar column
        DB::statement("ALTER TABLE equipment_handover MODIFY COLUMN final_condition ENUM('excellent', 'good', 'fair', 'damaged', 'partially_damaged') NOT NULL DEFAULT 'good'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("ALTER TABLE handover_reports MODIFY COLUMN condition_status ENUM('good', 'damaged', 'partially_damaged') NOT NULL DEFAULT 'good'");
        DB::statement("ALTER TABLE equipment_handover MODIFY COLUMN final_condition ENUM('good', 'damaged', 'partially_damaged') NOT NULL DEFAULT 'good'");
    }
};
