<?php
namespace App\Domains\Equipment\Enums;

enum EquipmentStatus: string
{
    case Active  = 'active';
    case Hidden  = 'hidden';
    case Deleted = 'deleted';
}