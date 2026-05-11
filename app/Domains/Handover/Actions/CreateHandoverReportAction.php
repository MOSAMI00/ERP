<?php

namespace App\Domains\Handover\Actions;

use App\Domains\Handover\Enums\HandoverPhase;
use App\Models\HandoverReport;
use App\Models\RentalOperation;
use App\Models\User;

class CreateHandoverReportAction
{
    public function handle(
        RentalOperation $rental,
        User $submittedBy,
        HandoverPhase $phase,
        array $data,
    ): HandoverReport {
        return HandoverReport::create([
            'rental_op_id'      => $rental->id,
            'phase'             => $phase,
            'submitted_by_id'   => $submittedBy->id,
            'submitted_by_role' => $data['submitted_by_role'],
            'notes'             => $data['notes'] ?? null,
            'has_issues'        => $data['has_issues'] ?? false,
            'condition_status'  => $data['condition_status'],
        ]);
    }
}
