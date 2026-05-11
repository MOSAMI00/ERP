<?php

namespace App\Domains\Shared\Exceptions;

class PaymentException extends DomainException
{
    public static function alreadyProcessed(): static
    {
        return new static('Payment has already been processed.');
    }

    public static function deductionExceedsInsurance(float $deduction, float $insurance): static
    {
        return new static("Deduction [{$deduction}] exceeds insurance [{$insurance}].");
    }

    public static function invalidAmount(string $reason): static
    {
        return new static($reason);
    }
}
