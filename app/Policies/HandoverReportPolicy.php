<?php
// app/Policies/HandoverReportPolicy.php

namespace App\Policies;

use App\Models\HandoverReport;
use App\Models\User;

class HandoverReportPolicy
{
    public function view(User $user, HandoverReport $report): bool
    {
        return $user->id === $report->rental->tenant_id
            || $user->id === $report->rental->owner_id;
    }

    public function confirm(User $user, HandoverReport $report): bool
    {
        // الطرف الثاني يؤكد (ليس من رفع التقرير)
        return $this->view($user, $report)
            && $user->id !== $report->submitted_by_id
            && $report->confirmed_at === null;
    }
}