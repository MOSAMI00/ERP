<?php

namespace App\Domains\User\Enums;

enum KycStatus: string
{
    case Pending  = 'pending';
    case Approved = 'approved';
    case Rejected = 'rejected';
}