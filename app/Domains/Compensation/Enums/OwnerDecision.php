<?php

namespace App\Domains\Compensation\Enums;

enum OwnerDecision: string
{
    case FullRefund    = 'full_refund';
    case PartialRefund = 'partial_refund';
    case NoRefund      = 'no_refund';
}