<?php

namespace App\Domains\Rental\Services;

use App\Domains\Rental\Enums\RentalStatus;
use App\Domains\Shared\Exceptions\InvalidStateTransitionException;
use App\Models\RentalOperation;

class RentalStateResolver
{
    // ══════════════════════════════════════════
    // Guards — يرمي DomainException
    // ══════════════════════════════════════════

    public function canApprove(RentalOperation $rental): void
    {
        $this->mustBe($rental, RentalStatus::Pending);
    }

    public function canPay(RentalOperation $rental): void
    {
        $this->mustBe($rental, RentalStatus::Confirmed);
        $this->mustNotBeExpired($rental);
    }

    // ✦ أوضح من canPay — للاستخدام في cancelByTimeout
    public function mustBeAwaitingPayment(RentalOperation $rental): void
    {
        $this->mustBe($rental, RentalStatus::Confirmed);
    }

    public function canSubmitDeliveryReport(RentalOperation $rental): void
    {
        $this->mustBe($rental, RentalStatus::Paid);
    }

    public function canSubmitReturnReport(RentalOperation $rental): void
    {
        $this->mustBe($rental, RentalStatus::InUse);
    }

    // ✦ النزاع يُفتح بعد طلب التعويض — وليس بعد Completed
    // ✦ التعويض يُطلب بعد الإرجاع وقبل إغلاق العملية
    // المؤجر يطلبه والعملية لا تزال InUse
    public function canRequestCompensation(RentalOperation $rental): void
    {
        $this->mustBeIn($rental, [
            RentalStatus::InUse,
            RentalStatus::ReturnDone,
            RentalStatus::CompensationRequested,
            RentalStatus::Disputed,
            RentalStatus::Completed,
        ]);
    }

    // ✦ النزاع يُفتح داخل نافذة الاعتراض — يُحوّل الحالة إلى Disputed
    // وليس بعد أن تصبح Disputed
    public function canOpenDispute(RentalOperation $rental): void
    {
        $this->mustBeIn($rental, [
            RentalStatus::InUse,
            RentalStatus::ReturnDone,
            RentalStatus::CompensationRequested,
            RentalStatus::Disputed,
            RentalStatus::Completed,
        ]);
    }

    public function canBeCancelledByTenant(RentalOperation $rental): void
    {
        $this->mustBeIn($rental, [
            RentalStatus::Pending,
            RentalStatus::Confirmed,
        ]);
    }

    public function canBeCancelledByOwner(RentalOperation $rental): void
    {
        $this->mustBeIn($rental, [
            RentalStatus::Pending,
            RentalStatus::Confirmed,
        ]);
    }

    // ══════════════════════════════════════════
    // Boolean checks — للـ UI والـ Policy
    // ══════════════════════════════════════════

    public function isApprovable(RentalOperation $rental): bool
    {
        return $rental->status === RentalStatus::Pending;
    }

    public function isPayable(RentalOperation $rental): bool
    {
        return $rental->status === RentalStatus::Confirmed
            && ! $this->isDeadlineExpired($rental);
    }

    public function isAwaitingPayment(RentalOperation $rental): bool
    {
        return $rental->status === RentalStatus::Confirmed;
    }

    public function isCancellable(RentalOperation $rental): bool
    {
        return $this->hasStatus($rental, [
            RentalStatus::Pending,
            RentalStatus::Confirmed,
        ]);
    }

    // ══════════════════════════════════════════
    // Private helpers
    // ══════════════════════════════════════════

    private function mustBe(RentalOperation $rental, RentalStatus $status): void
    {
        if ($rental->status !== $status) {
            throw InvalidStateTransitionException::expected($status->value, $rental->status->value);
        }
    }

    private function mustBeIn(RentalOperation $rental, array $statuses): void
    {
        if (! $this->hasStatus($rental, $statuses)) {
            throw InvalidStateTransitionException::expectedOneOf(
                array_map(fn($s) => $s->value, $statuses),
                $rental->status->value,
            );
        }
    }

    private function mustNotBeExpired(RentalOperation $rental): void
    {
        if ($this->isDeadlineExpired($rental)) {
            throw InvalidStateTransitionException::expected('payment deadline not expired', 'expired');
        }
    }

    // ✦ helper مركزي لـ in_array على Enums
    private function hasStatus(RentalOperation $rental, array $statuses): bool
    {
        return in_array($rental->status, $statuses, strict: true);
    }

    private function isDeadlineExpired(RentalOperation $rental): bool
    {
        return $rental->payment_deadline !== null
            && now()->isAfter($rental->payment_deadline);
    }
}
