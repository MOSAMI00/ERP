<?php

namespace App\Domains\Review\Enums;

enum ReviewStatus: string
{
    case Visible = 'visible';
    case Hidden  = 'hidden';
    case Deleted = 'deleted';
    case Flagged = 'flagged';
}
