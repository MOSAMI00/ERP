<?php

namespace App\Domains\User\Actions;

use App\Domains\User\Enums\KycStatus;
use App\Models\KycDocument;

class UpdateKycStatusAction
{
    public function __invoke(KycDocument $document, KycStatus $status, ?string $reason = null): KycDocument
    {
        $document->update([
            'status'           => $status,
            'rejection_reason' => $reason,
        ]);

        // ✦ تحديث حالة المستخدم بناءً على الوثيقة
        if ($status === KycStatus::Approved) {
            $document->user->update(['kyc_verified_at' => now()]);
        } elseif ($status === KycStatus::Rejected) {
            $document->user->update(['kyc_verified_at' => null]);
        }

        return $document->refresh();
    }
}