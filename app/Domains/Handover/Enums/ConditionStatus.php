<?php

namespace App\Domains\Handover\Enums;

enum ConditionStatus: string
{
    case Excellent        = 'excellent';
    case Good             = 'good';
    case Fair             = 'fair';
    case Damaged          = 'damaged';
    case PartiallyDamaged = 'partially_damaged';
}