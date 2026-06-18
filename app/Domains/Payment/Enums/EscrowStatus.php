<?php

namespace App\Domains\Payment\Enums;

enum EscrowStatus: string
{
    case Held     = 'held';
    case Released = 'released';
    case Refunded = 'refunded';
}