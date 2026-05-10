<?php

namespace App\Domains\Rental\Services;

use App\Models\User;

class RentalWorkflowService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    public function createRental(array $data, User $tenant)
    {
        $rental = DB::transaction(function () use ($data, $tenant) {
            $rental = $this->createRental->handle($data, $tenant);
            $this->createContract->handle($rental);
            $this->audit->log('rental_created', $rental);
            return $rental;
        });

        $this->notifications->notifyOwner($rental, 'new_rental_request');

        return $rental;
    }
}
