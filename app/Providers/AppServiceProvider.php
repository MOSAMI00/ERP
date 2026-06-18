<?php

namespace App\Providers;

use App\Models\Contract;
use App\Models\Dispute;
use App\Models\Admin;
use App\Models\Equipment;
use App\Models\EquipmentHandover;
use App\Models\HandoverReport;
use App\Models\Payment;
use App\Models\RentalOperation;
use App\Models\Review;
use App\Models\User;
use App\Policies\ContractPolicy;
use App\Policies\DisputePolicy;
use App\Policies\EquipmentHandoverPolicy;
use App\Policies\EquipmentPolicy;
use App\Policies\HandoverReportPolicy;
use App\Policies\PaymentPolicy;
use App\Policies\RentalOperationPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::policy(Equipment::class, EquipmentPolicy::class);
        Gate::policy(RentalOperation::class, RentalOperationPolicy::class);
        Gate::policy(Contract::class, ContractPolicy::class);
        Gate::policy(Payment::class, PaymentPolicy::class);
        Gate::policy(HandoverReport::class, HandoverReportPolicy::class);
        Gate::policy(EquipmentHandover::class, EquipmentHandoverPolicy::class);
        Gate::policy(Dispute::class, DisputePolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);

        Relation::morphMap([
            'admin' => Admin::class,
            'user' => User::class,
            'equipment' => Equipment::class,
        ]);
    }
}
