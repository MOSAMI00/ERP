<?php
namespace App\Domains\Equipment\Enums;

enum AvailabilityReason: string
{
    case Booked       = 'booked';
    case OwnerBlocked = 'owner_blocked';
}