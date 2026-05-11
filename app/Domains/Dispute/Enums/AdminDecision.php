<?php

namespace App\Domains\Dispute\Enums;

enum AdminDecision: string
{
    case AcceptDeduction      = 'accept_deduction';
    case RejectDeduction      = 'reject_deduction';
    case ModifyCompensation   = 'modify_compensation';
}