<?php

namespace App\Domains\Payment\Enums;

enum PaymentType: string
{
    case Rental           = 'rental';
    case Insurance        = 'insurance';
    case InsuranceRefund  = 'insurance_refund';
    case OwnerTransfer    = 'owner_transfer';
    case Compensation     = 'compensation';
}