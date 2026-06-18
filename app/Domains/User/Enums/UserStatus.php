<?php

namespace App\Domains\User\Enums;

enum UserStatus: string
{
    case Active    = 'active';
    case Suspended = 'suspended';
    case Banned    = 'banned';
}