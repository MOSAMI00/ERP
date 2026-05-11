<?php

namespace App\Domains\Shared\Exceptions;

class InvalidStateTransitionException extends DomainException
{
    public static function expected(string $expected, string $actual): static
    {
        return new static("Expected [{$expected}], got [{$actual}].");
    }

    public static function expectedOneOf(array $allowed, string $actual): static
    {
        $list = implode(', ', $allowed);

        return new static("Expected one of [{$list}], got [{$actual}].");
    }
}
