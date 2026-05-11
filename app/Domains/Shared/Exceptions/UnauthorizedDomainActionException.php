<?php

namespace App\Domains\Shared\Exceptions;

class UnauthorizedDomainActionException extends DomainException
{
    public static function notParticipant(): static
    {
        return new static('You are not a participant in this operation.');
    }

    public static function notOwner(): static
    {
        return new static('Only the rental owner can perform this action.');
    }

    public static function notTenant(): static
    {
        return new static('Only the rental tenant can perform this action.');
    }
}
