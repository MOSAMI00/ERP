<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('platform_settings', function (Blueprint $table) {
            if (! Schema::hasColumn('platform_settings', 'platform_terms')) {
                $table->longText('platform_terms')->nullable()->after('kyc_required');
            }

            if (! Schema::hasColumn('platform_settings', 'contract_template')) {
                $table->longText('contract_template')->nullable()->after('platform_terms');
            }
        });

        Schema::table('notifications', function (Blueprint $table) {
            if (! Schema::hasColumn('notifications', 'action_url')) {
                $table->string('action_url')->nullable()->after('reference_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            if (Schema::hasColumn('notifications', 'action_url')) {
                $table->dropColumn('action_url');
            }
        });

        Schema::table('platform_settings', function (Blueprint $table) {
            if (Schema::hasColumn('platform_settings', 'contract_template')) {
                $table->dropColumn('contract_template');
            }

            if (Schema::hasColumn('platform_settings', 'platform_terms')) {
                $table->dropColumn('platform_terms');
            }
        });
    }
};
