<?php

namespace App\Shared\Notifications;

use App\Models\RentalOperation;
use App\Models\User;
use App\Models\Admin;
use App\Models\Notification;

class NotificationService
{
    public function notifyTenant(RentalOperation $rental, string $event): void
    {
        $this->create('user', $rental->tenant_id, $event, 'rental', $rental->id, $this->rentalActionUrl($rental, 'tenant', $event));
    }

    public function notifyOwner(RentalOperation $rental, string $event): void
    {
        $this->create('user', $rental->owner_id, $event, 'rental', $rental->id, $this->rentalActionUrl($rental, 'owner', $event));
    }

    public function notifyBoth(RentalOperation $rental, string $event): void
    {
        $this->notifyTenant($rental, $event);
        $this->notifyOwner($rental, $event);
    }

    public function notifyUser(User $user, string $event): void
    {
        $this->create('user', $user->id, $event, 'user', $user->id, $this->userActionUrl($event));
    }

    public function notifyAdmins(string $event): void
    {
        Admin::query()
            ->where('status', 'active')
            ->each(fn (Admin $admin) => $this->create('admin', $admin->id, $event, null, null, $this->adminActionUrl($event)));
    }

    private function create(
        string $recipientType,
        int $recipientId,
        string $event,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?string $actionUrl = null,
    ): void {
        $content = $this->contentFor($event);

        Notification::create([
            'recipient_type' => $recipientType,
            'recipient_id' => $recipientId,
            'type' => $event,
            'title' => $content['title'],
            'body' => $content['body'],
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'action_url' => $actionUrl,
            'priority' => 'medium',
        ]);
    }

    private function contentFor(string $event): array
    {
        return [
            'new_rental_request' => ['title' => 'تم استقبال طلب إيجار جديد', 'body' => 'لديك طلب إيجار جديد بانتظار المراجعة والتوقيع.'],
            'rental_approved' => ['title' => 'تمت الموافقة على طلبك', 'body' => 'وافق المؤجر على الطلب. يمكنك الآن إتمام الدفع خلال المهلة المحددة.'],
            'rental_rejected' => ['title' => 'تم رفض طلب التأجير', 'body' => 'رفض المؤجر طلب التأجير. يمكنك اختيار معدة أخرى.'],
            'rental_cancelled' => ['title' => 'تم إلغاء عملية التأجير', 'body' => 'تم إلغاء العملية قبل اكتمالها.'],
            'payment_deadline_expired' => ['title' => 'انتهت مهلة الدفع', 'body' => 'تم إلغاء العملية لانتهاء مهلة الدفع.'],
            'payment_received' => ['title' => 'تم تأكيد الدفع بنجاح', 'body' => 'تم استلام الدفعة وحجز المبلغ في الضمان.'],
            'payment_confirmed' => ['title' => 'تم تأكيد الدفع بنجاح', 'body' => 'تم حفظ المبلغ في الضمان ويمكن متابعة إجراءات التسليم.'],
            'funds_transferred' => ['title' => 'تم تحويل الأرباح', 'body' => 'تم تحويل أرباح العملية إلى رصيدك.'],
            'insurance_refunded' => ['title' => 'تم رد التأمين', 'body' => 'تم رد مبلغ التأمين بعد اكتمال العملية.'],
            'insurance_partial_refund' => ['title' => 'تم رد جزء من التأمين', 'body' => 'تم رد المتبقي من التأمين بعد احتساب التعويض.'],
            'payment_refunded' => ['title' => 'تم رد الدفعة', 'body' => 'تم تنفيذ عملية رد الدفعة.'],
            'delivery_report_submitted' => ['title' => 'تم رفع محضر التسليم', 'body' => 'تم رفع محضر التسليم وهو بانتظار المراجعة.'],
            'delivery_confirmed_by_tenant' => ['title' => 'تم تأكيد الاستلام', 'body' => 'أكد المستأجر استلام المعدة.'],
            'rental_started' => ['title' => 'بدأت فترة التأجير', 'body' => 'تم اكتمال التسليم وبدأت فترة استخدام المعدة.'],
            'return_report_submitted' => ['title' => 'تم رفع محضر الإرجاع', 'body' => 'تم رفع محضر الإرجاع وهو بانتظار المراجعة.'],
            'return_confirmed_by_owner' => ['title' => 'تم تأكيد الإرجاع', 'body' => 'أكد المؤجر استلام المعدة.'],
            'equipment_returned' => ['title' => 'تم إرجاع المعدة', 'body' => 'اكتملت خطوة إرجاع المعدة.'],
            'equipment_evaluated' => ['title' => 'تم تقييم حالة المعدة', 'body' => 'تم تسجيل نتيجة فحص المعدة بعد الإرجاع.'],
            'rental_completed' => ['title' => 'اكتملت عملية التأجير', 'body' => 'تم إنهاء العملية بنجاح.'],
            'compensation_requested' => ['title' => 'تم طلب تعويض', 'body' => 'يوجد طلب تعويض مرتبط بهذه العملية.'],
            'compensation_settled' => ['title' => 'تمت تسوية التعويض', 'body' => 'تم تسجيل تسوية التعويض لهذه العملية.'],
            'compensation_auto_settled' => ['title' => 'تمت تسوية التعويض تلقائياً', 'body' => 'تمت التسوية حسب سياسة المنصة.'],
            'dispute_opened' => ['title' => 'تم فتح نزاع', 'body' => 'تم فتح نزاع وسيتم مراجعته من الإدارة.'],
            'dispute_under_review' => ['title' => 'النزاع قيد المراجعة', 'body' => 'بدأت الإدارة مراجعة النزاع والتقارير المرتبطة به.'],
            'dispute_resolved' => ['title' => 'تم حل النزاع', 'body' => 'تم إصدار قرار الإدارة في النزاع.'],
            'new_dispute_requires_review' => ['title' => 'نزاع جديد يحتاج مراجعة', 'body' => 'يوجد نزاع جديد بانتظار قرار الإدارة.'],
            'kyc_approved' => ['title' => 'تم اعتماد توثيق الهوية', 'body' => 'تم قبول وثائق الهوية ويمكنك استخدام ميزات المنصة.'],
            'kyc_rejected' => ['title' => 'تم رفض توثيق الهوية', 'body' => 'يرجى مراجعة سبب الرفض ورفع الوثائق من جديد.'],
        ][$event] ?? ['title' => 'تنبيه جديد', 'body' => 'لديك تحديث جديد في المنصة.'];
    }

    private function rentalActionUrl(RentalOperation $rental, string $recipientRole, string $event): string
    {
        if ($recipientRole === 'owner') {
            return $event === 'new_rental_request'
                ? '/owner/requests'
                : "/rentals/{$rental->id}";
        }

        return "/rentals/{$rental->id}";
    }

    private function userActionUrl(string $event): string
    {
        return str_starts_with($event, 'kyc_') ? '/settings?tab=kyc' : '/settings';
    }

    private function adminActionUrl(string $event): string
    {
        return $event === 'new_dispute_requires_review' ? '/admin/disputes' : '/admin';
    }
}
