<?php

namespace App\Domains\Dispute\Enums;

enum DisputeStatus: string
{
    case Open        = 'open';
    case UnderReview = 'under_review';
    case Resolved    = 'resolved';
}