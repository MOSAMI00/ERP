<?php

namespace App\Domains\Handover\Enums;

enum ConditionStatus: string
{
    case Good             = 'good';
    case Damaged          = 'damaged';
    case PartiallyDamaged = 'partially_damaged';
}