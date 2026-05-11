<?php

namespace App\Domains\Rental\Services;

use App\Domains\Rental\Actions\CancelRentalAction;
use App\Domains\Rental\Actions\CreateContractAction;
use App\Domains\Rental\Actions\CreateRentalAction;
use App\Domains\Rental\Actions\SetPaymentDeadlineAction;
use App\Domains\Rental\Actions\SignOwnerContractAction;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalAvailabilityService;
use App\Models\RentalOperation;
use App\Models\User;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use App\Shared\Settings\PlatformSettingsService;
use Illuminate\Support\Facades\DB;

class RentalWorkflowService
{
    public function __construct(
        private CreateRentalAction        $createRental,
        private CreateContractAction      $createContract,
        private SignOwnerContractAction   $signOwnerContract,
        private UpdateRentalStatusAction  $updateStatus,
        private SetPaymentDeadlineAction  $setDeadline,
        private CancelRentalAction        $cancelRental,
        private RentalStateResolver       $stateResolver,
        private RentalAvailabilityService $availability,
        private NotificationService       $notifications,
        private AuditLogService           $audit,
        private PlatformSettingsService   $settings,
    ) {}

    // ══════════════════════════════════════════
    // [2+3] إنشاء طلب الإيجار
    // ══════════════════════════════════════════
    public function createRental(array $data, User $tenant): RentalOperation
    {
        $this->availability->validateForSubmit(
            $data['equipment_id'],
            $data['start_date'],
            $data['end_date'],
        );

        $rental = DB::transaction(function () use ($data, $tenant) {
            $rental = $this->createRental->handle($data, $tenant);
            $this->createContract->handle($rental);
            $this->audit->log('rental_created', $rental);
            return $rental;
        });

        $this->notifications->notifyOwner($rental, 'new_rental_request');

        return $rental;
    }

    // ══════════════════════════════════════════
    // [4B] المؤجر يوافق
    // ══════════════════════════════════════════
    public function approveRental(RentalOperation $rental): void
    {
        DB::transaction(function () use ($rental) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->canApprove($rental);

            $hours = $this->settings->getPaymentDeadlineHours();

            $this->availability->reserveForRental($rental);
            if (! $rental->contract()->exists()) {
                $this->createContract->handle($rental);
                $rental->load('contract');
            }
            $this->signOwnerContract->handle($rental);
            $this->updateStatus->handle($rental, RentalStatus::Confirmed);
            $this->setDeadline->handle($rental, $hours);
            $this->audit->log('rental_approved', $rental);
        });

        $this->notifications->notifyTenant($rental, 'rental_approved');
    }

    // ══════════════════════════════════════════
    // [4A] المؤجر يرفض
    // ══════════════════════════════════════════
    public function rejectRental(RentalOperation $rental, string $reason): void
    {
        DB::transaction(function () use ($rental, $reason) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->canApprove($rental);

            $this->cancelRental->handle($rental, $reason, RentalStatus::Cancelled);
            $this->audit->log('rental_rejected', $rental);
        });

        $this->notifications->notifyTenant($rental, 'rental_rejected');
    }

    // ══════════════════════════════════════════
    // [5B] المستأجر يلغي
    // ══════════════════════════════════════════
    public function cancelByTenant(RentalOperation $rental, string $reason): void
    {
        DB::transaction(function () use ($rental, $reason) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->canBeCancelledByTenant($rental);

            $this->availability->releaseForRental($rental);
            $this->cancelRental->handle($rental, $reason, RentalStatus::Cancelled);
            $this->audit->log('rental_cancelled_by_tenant', $rental);
        });

        $this->notifications->notifyOwner($rental, 'rental_cancelled');
    }

    // ══════════════════════════════════════════
    // [5C] المؤجر يلغي
    // ══════════════════════════════════════════
    public function cancelByOwner(RentalOperation $rental, string $reason): void
    {
        DB::transaction(function () use ($rental, $reason) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->canBeCancelledByOwner($rental);

            $this->availability->releaseForRental($rental);
            $this->cancelRental->handle($rental, $reason, RentalStatus::Cancelled);
            $this->audit->log('rental_cancelled_by_owner', $rental);
        });

        $this->notifications->notifyTenant($rental, 'rental_cancelled');
    }

    // ══════════════════════════════════════════
    // [5D] انتهت مهلة الدفع — يستدعيها Cron
    // ══════════════════════════════════════════
    // [5D] انتهت مهلة الدفع — يستدعيها Cron
    public function cancelByTimeout(RentalOperation $rental): void
    {
        DB::transaction(function () use ($rental) {
            $rental = RentalOperation::query()->whereKey($rental->id)->lockForUpdate()->firstOrFail();
            $this->stateResolver->mustBeAwaitingPayment($rental);

            $this->availability->releaseForRental($rental);
            $this->cancelRental->handle($rental, 'payment_timeout', RentalStatus::Cancelled);
            $this->audit->log('rental_cancelled_timeout', $rental);
        });

        $this->notifications->notifyTenant($rental, 'payment_deadline_expired');
        $this->notifications->notifyOwner($rental, 'payment_deadline_expired');
    }
}
