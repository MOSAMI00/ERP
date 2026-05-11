<?php

namespace App\Domains\Handover\Services;

use App\Domains\Handover\Actions\CreateHandoverReportAction;
use App\Domains\Handover\Actions\UploadHandoverImagesAction;
use App\Domains\Handover\Enums\HandoverPhase;
use App\Domains\Rental\Actions\UpdateRentalStatusAction;
use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Rental\Services\RentalStateResolver;
use App\Models\RentalOperation;
use App\Models\User;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use Illuminate\Support\Facades\DB;

class HandoverWorkflowService
{
    public function __construct(
        private CreateHandoverReportAction  $createReport,
        private UploadHandoverImagesAction  $uploadImages,
        private UpdateRentalStatusAction    $updateRentalStatus,
        private RentalStateResolver         $stateResolver,
        private NotificationService         $notifications,
        private AuditLogService             $audit,
    ) {}

    // ══════════════════════════════════════════
    // [6A] المؤجر يرفع تقرير التسليم
    // ══════════════════════════════════════════
    public function submitOwnerDeliveryReport(
        RentalOperation $rental,
        User $owner,
        array $reportData,
        array $images = []
    ): void {
        $this->stateResolver->canSubmitDeliveryReport($rental);

        // ✦ Duplicate protection
        $this->mustNotHaveReport($rental, HandoverPhase::Delivery, $owner->id);

        DB::transaction(function () use ($rental, $owner, $reportData, $images) {
            $report = $this->createReport->handle($rental, $owner, HandoverPhase::Delivery, $reportData);

            if (! empty($images)) {
                $this->uploadImages->handle($report, $images);
            }

            $this->audit->log('owner_delivery_report_submitted', $rental);
        });

        $this->notifications->notifyTenant($rental, 'delivery_report_submitted');
    }

    // ══════════════════════════════════════════
    // [6B] المستأجر يؤكد الاستلام
    // ══════════════════════════════════════════
    public function submitTenantDeliveryReport(
        RentalOperation $rental,
        User $tenant,
        array $reportData,
        array $images = []
    ): void {
        $this->stateResolver->canSubmitDeliveryReport($rental);

        // ✦ Duplicate protection
        $this->mustNotHaveReport($rental, HandoverPhase::Delivery, $tenant->id);

        // ✦ المؤجر يجب أن يرفع أولاً
        $this->mustHaveReport($rental, HandoverPhase::Delivery, $rental->owner_id);

        DB::transaction(function () use ($rental, $tenant, $reportData, $images) {
            $report = $this->createReport->handle($rental, $tenant, HandoverPhase::Delivery, $reportData);

            if (! empty($images)) {
                $this->uploadImages->handle($report, $images);
            }

            // ✦ كلا الطرفين رفعا → in_use
            $this->updateRentalStatus->handle($rental, RentalStatus::InUse);
            $this->audit->log('tenant_delivery_confirmed', $rental);
        });

        $this->notifications->notifyOwner($rental, 'delivery_confirmed_by_tenant');
        $this->notifications->notifyBoth($rental, 'rental_started');
    }

    // ══════════════════════════════════════════
    // [8A] المستأجر يرفع تقرير الإرجاع
    // ══════════════════════════════════════════
    public function submitTenantReturnReport(
        RentalOperation $rental,
        User $tenant,
        array $reportData,
        array $images = []
    ): void {
        $this->stateResolver->canSubmitReturnReport($rental);

        // ✦ Duplicate protection
        $this->mustNotHaveReport($rental, HandoverPhase::Return, $tenant->id);

        DB::transaction(function () use ($rental, $tenant, $reportData, $images) {
            $report = $this->createReport->handle($rental, $tenant, HandoverPhase::Return, $reportData);

            if (! empty($images)) {
                $this->uploadImages->handle($report, $images);
            }

            $this->audit->log('tenant_return_report_submitted', $rental);
        });

        $this->notifications->notifyOwner($rental, 'return_report_submitted');
    }

    // ══════════════════════════════════════════
    // [8B] المؤجر يؤكد استلام المعدة
    // ══════════════════════════════════════════
    public function submitOwnerReturnReport(
        RentalOperation $rental,
        User $owner,
        array $reportData,
        array $images = []
    ): void {
        $this->stateResolver->canSubmitReturnReport($rental);

        // ✦ Duplicate protection
        $this->mustNotHaveReport($rental, HandoverPhase::Return, $owner->id);

        // ✦ المستأجر يجب أن يرفع أولاً
        $this->mustHaveReport($rental, HandoverPhase::Return, $rental->tenant_id);

        DB::transaction(function () use ($rental, $owner, $reportData, $images) {
            $report = $this->createReport->handle($rental, $owner, HandoverPhase::Return, $reportData);

            if (! empty($images)) {
                $this->uploadImages->handle($report, $images);
            }

            $this->audit->log('owner_return_report_submitted', $rental);
        });

        $this->notifications->notifyTenant($rental, 'return_confirmed_by_owner');
        $this->notifications->notifyBoth($rental, 'equipment_returned');
    }

    // ══════════════════════════════════════════
    // Private helpers
    // ══════════════════════════════════════════

    // ✦ يرمي exception لو الطرف رفع تقرير من نفس النوع مسبقاً
    private function mustNotHaveReport(
        RentalOperation $rental,
        HandoverPhase $phase,
        int $userId
    ): void {
        $exists = $rental->handoverReports()
            ->where('phase', $phase->value)
            ->where('submitted_by_id', $userId)
            ->exists();

        if ($exists) {
            throw new \DomainException(
                "User [{$userId}] already submitted a [{$phase->value}] report for this rental."
            );
        }
    }

    // ✦ يرمي exception لو الطرف المطلوب لم يرفع بعد
    private function mustHaveReport(
        RentalOperation $rental,
        HandoverPhase $phase,
        int $userId
    ): void {
        $exists = $rental->handoverReports()
            ->where('phase', $phase->value)
            ->where('submitted_by_id', $userId)
            ->exists();

        if (! $exists) {
            throw new \DomainException(
                "User [{$userId}] has not submitted [{$phase->value}] report yet."
            );
        }
    }
}