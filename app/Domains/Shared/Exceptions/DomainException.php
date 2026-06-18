<?php

namespace App\Domains\Shared\Exceptions;

class DomainException extends \DomainException
{
    public function __construct(string $message = '', int $code = 422, ?\Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
    }
}
