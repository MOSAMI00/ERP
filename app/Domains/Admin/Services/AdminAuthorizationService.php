<?php
namespace App\Domains\Admin\Services;

use App\Domains\Shared\Exceptions\UnauthorizedDomainActionException;
use App\Models\Admin;

class AdminAuthorizationService
{
    public function hasPermission(Admin $admin, string $permission): bool
    {
        return (bool) ($admin->role?->$permission ?? false);
    }

    public function assertPermission(Admin $admin, string $permission): void
    {
        if (! $this->hasPermission($admin, $permission)) {
            throw new UnauthorizedDomainActionException("Admin lacks permission: [{$permission}].");
        }
    }

    public function canManageUsers(Admin $admin): bool     { return $this->hasPermission($admin, 'can_manage_users'); }
    public function canManageEquipment(Admin $admin): bool { return $this->hasPermission($admin, 'can_manage_equipment'); }
    public function canManageRentals(Admin $admin): bool   { return $this->hasPermission($admin, 'can_manage_rentals'); }
    public function canManageDisputes(Admin $admin): bool  { return $this->hasPermission($admin, 'can_manage_disputes'); }
    public function canManageFinancial(Admin $admin): bool { return $this->hasPermission($admin, 'can_manage_financial'); }
    public function canManageReviews(Admin $admin): bool   { return $this->hasPermission($admin, 'can_manage_reviews'); }
    public function canManageSettings(Admin $admin): bool  { return $this->hasPermission($admin, 'can_manage_settings'); }
    public function canViewAuditLog(Admin $admin): bool    { return $this->hasPermission($admin, 'can_view_audit_log'); }
}