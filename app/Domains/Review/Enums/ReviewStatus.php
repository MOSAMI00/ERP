<?php

namespace App\Domains\Review\Enums;

enum ReviewStatus: string
{
    case Published = 'published';
    case Hidden    = 'hidden';
}