<?php

namespace App\Domains\User\Services;

use App\Domains\User\Actions\UpdateKycStatusAction;
use App\Domains\User\Enums\KycStatus;
use App\Shared\Audit\AuditLogService;
use App\Shared\Notifications\NotificationService;
use App\Models\KycDocument;
use App\Models\Admin;
use Illuminate\Support\Facades\DB;

class KycVerificationService
{
    public function __construct(
        private UpdateKycStatusAction $updateKyc,
        private NotificationService   $notifications,
        private AuditLogService       $audit,
    ) {}

    public function approve(KycDocument $document, Admin $admin): KycDocument
    {
        if ($document->status !== KycStatus::Pending) {
            throw new \DomainException('Only pending KYC documents can be approved.');
        }

        DB::transaction(function () use ($document, $admin) {
            ($this->updateKyc)($document, KycStatus::Approved);
            $this->audit->log('kyc_document_approved', $document, $admin);
        });

        $this->notifications->notifyUser($document->user, 'kyc_approved');

        return $document->refresh();
    }

    public function reject(KycDocument $document, Admin $admin, string $reason): KycDocument
    {
        if ($document->status !== KycStatus::Pending) {
            throw new \DomainException('Only pending KYC documents can be rejected.');
        }

        DB::transaction(function () use ($document, $admin, $reason) {
            ($this->updateKyc)($document, KycStatus::Rejected, $reason);
            $this->audit->log('kyc_document_rejected', $document, $admin);
        });

        $this->notifications->notifyUser($document->user, 'kyc_rejected');

        return $document->refresh();
    }
}