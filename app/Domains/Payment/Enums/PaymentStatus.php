<?php

namespace App\Domains\Payment\Enums;

enum PaymentStatus: string
{
    case Pending    = 'pending';
    case Processing = 'processing';
    case Paid       = 'paid';
    case Failed     = 'failed';      // ✦ بدل Stopped
    case Cancelled  = 'cancelled';   // ✦ إلغاء واضح
    case Refunded   = 'refunded';
}
