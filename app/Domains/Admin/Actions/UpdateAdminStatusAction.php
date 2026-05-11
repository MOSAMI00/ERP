<?php

namespace App\Domains\Admin\Actions;

use App\Domains\Admin\Enums\AdminStatus;
use App\Models\Admin;

class UpdateAdminStatusAction
{
    public function __invoke(Admin $admin, AdminStatus $status): Admin
    {
        $admin->update(['status' => $status]);
        return $admin->refresh();
    }
}
