<?php
namespace App\Domains\Admin\Services;

use App\Domains\Admin\Actions\CreateAdminAction;
use App\Domains\Admin\Actions\UpdateAdminStatusAction;
use App\Domains\Admin\Enums\AdminStatus;
use App\Shared\Audit\AuditLogService;
use App\Models\Admin;

class AdminManagementService
{
    public function __construct(
        private CreateAdminAction       $createAdminAction,
        private UpdateAdminStatusAction $updateStatus,
        private AuditLogService         $audit,
    ) {}

    public function createAdmin(array $data, Admin $createdBy): Admin
    {
        $admin = ($this->createAdminAction)($data);
        $this->audit->log('admin_created', $admin, $createdBy);
        return $admin;
    }

    public function updateAdminRole(Admin $admin, int $roleId, Admin $updatedBy): Admin
    {
        $admin->update(['role_id' => $roleId]);
        $this->audit->log('admin_role_updated', $admin, $updatedBy);
        return $admin->refresh();
    }

    public function suspendAdmin(Admin $admin, Admin $suspendedBy): Admin
    {
        ($this->updateStatus)($admin, AdminStatus::Suspended);
        $this->audit->log('admin_suspended', $admin, $suspendedBy);
        return $admin->refresh();
    }

    public function reactivateAdmin(Admin $admin, Admin $reactivatedBy): Admin
    {
        ($this->updateStatus)($admin, AdminStatus::Active);
        $this->audit->log('admin_reactivated', $admin, $reactivatedBy);
        return $admin->refresh();
    }
}