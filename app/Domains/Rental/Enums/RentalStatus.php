<?php

namespace App\Domains\Rental\Enums;

enum RentalStatus: string
{
    case Pending   = 'pending';
    case Confirmed = 'confirmed';
    case Paid      = 'paid';
    case InUse     = 'in_use';
    case ReturnDone = 'return_done';
    case CompensationRequested = 'compensation_requested';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
    case Disputed  = 'disputed';
}