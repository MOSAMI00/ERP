<?php

namespace App\Domains\Handover\Enums;

enum HandoverPhase: string
{
    case Delivery = 'delivery';
    case Return   = 'return';
}