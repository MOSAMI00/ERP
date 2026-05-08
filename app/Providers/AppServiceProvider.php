<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        \App\Models\Equipment::class          => \App\Policies\EquipmentPolicy::class,
        \App\Models\RentalOperation::class    => \App\Policies\RentalOperationPolicy::class,
        \App\Models\Contract::class           => \App\Policies\ContractPolicy::class,
        \App\Models\Payment::class            => \App\Policies\PaymentPolicy::class,
        \App\Models\HandoverReport::class     => \App\Policies\HandoverReportPolicy::class,
        \App\Models\EquipmentHandover::class  => \App\Policies\EquipmentHandoverPolicy::class,
        \App\Models\Dispute::class            => \App\Policies\DisputePolicy::class,
        \App\Models\Review::class             => \App\Policies\ReviewPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}