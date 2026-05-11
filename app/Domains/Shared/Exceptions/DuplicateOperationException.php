<?php

namespace App\Domains\Shared\Exceptions;

class DuplicateOperationException extends DomainException
{
    public static function forModel(string $model, int|string $id): static
    {
        return new static("{$model} [{$id}] already has this record.");
    }
}
