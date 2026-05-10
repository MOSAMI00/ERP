<?php

namespace App\Domains\Rental\Enums;

enum RentalStatus: string
{
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Paid      = 'paid';
    case InUse     = 'in_use';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Disputed  = 'disputed';
}