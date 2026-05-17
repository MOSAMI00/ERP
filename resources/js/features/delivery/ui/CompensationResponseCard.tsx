import { useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';

function canRenderPhoto(photo) {
  return /^(data:|blob:|https?:\/\/|\/)/.test(photo);
}

const CONDITION_LABELS = {
  excellent: 'ممتازة',
  good: 'جيدة',
  fair: 'متوسطة',
  damaged: 'متضررة',
  partially_damaged: 'متضررة جزئياً',
};

const ADMIN_DECISION_LABELS = {
  accept_deduction: 'الإدارة قبلت مطالبة المؤجر بالكامل',
  reject_deduction: 'الإدارة رفضت الخصم وأعادت التأمين للمستأجر',
  modify_compensation: 'الإدارة اعتمدت مبلغ تعويض معدل',
};

export function CompensationResponseCard({
  compensation,
  onAccept,
  onReject,
  onOpenDispute,
}) {
  const [tenantClaim, setTenantClaim] = useState('');
  const [disputeAmount, setDisputeAmount] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  const isCompleted = compensation.rentalStatus === 'completed';
  const isDisputed = compensation.rentalStatus === 'disputed' || !!compensation.dispute;
  const isPendingTenant = 
    compensation.status === 'requested' || 
    compensation.status === 'partial_refund' || 
    compensation.status === 'no_refund';

  if (isCompleted) {
    const adminDecision = compensation.adminDecision ?? compensation.dispute?.adminDecision;
    const settledByAdmin = compensation.dispute?.status === 'resolved';
    return (
      <div className="mb-4 rounded-xl border-2 border-[#27AE60] bg-[#F4FAF6] p-5">
        <h4 className="m-0 text-base font-bold text-[#27AE60]">
          {settledByAdmin ? (ADMIN_DECISION_LABELS[adminDecision] ?? 'تمت التسوية بقرار إداري') : 'تمت تسوية مطالبة التعويض'}
        </h4>
        <p className="m-0 mt-2 text-sm text-[#555555]">طلب المؤجر: {formatCurrency(compensation.ownerRequestedAmount ?? compensation.requestedAmount)} ر.ي</p>
        {compensation.dispute ? (
          <p className="m-0 mt-1 text-sm text-[#555555]">اقتراحك عند فتح النزاع: {formatCurrency(compensation.tenantProposedAmount ?? 0)} ر.ي</p>
        ) : null}
        <p className="m-0 mt-1 text-sm font-bold text-[#222222]">
          المبلغ النهائي المخصوم من التأمين: {formatCurrency(compensation.finalAmount ?? compensation.requestedAmount)} ر.ي
        </p>
        {adminDecision === 'reject_deduction' ? (
          <p className="m-0 mt-1 text-sm font-bold text-[#27AE60]">سيتم إرجاع التأمين للمستأجر بدون خصم.</p>
        ) : null}
        {compensation.notes ? (
          <p className="m-0 mt-1 text-sm text-[#555555]">ملاحظات المؤجر: {compensation.notes}</p>
        ) : null}
        {compensation.dispute?.adminNote ? (
          <p className="m-0 mt-1 text-sm text-[#555555]">ملاحظة الإدارة: {compensation.dispute.adminNote}</p>
        ) : null}
      </div>
    );
  }

  if (isDisputed) {
    const disputeStatusLabel = compensation.dispute?.status === 'resolved'
      ? (ADMIN_DECISION_LABELS[compensation.dispute?.adminDecision] ?? 'تمت التسوية بقرار إداري')
      : 'قيد المراجعة الإدارية';
    return (
      <div className="mb-4 rounded-xl border-2 border-[#E74C3C] bg-[#FDEDEC] p-5">
        <h4 className="m-0 text-base font-bold text-[#E74C3C]">المطالبة تحولت إلى نزاع</h4>
        <p className="m-0 mt-2 text-sm text-[#555555]">
          حالة النزاع: {disputeStatusLabel}
        </p>
        <p className="m-0 mt-1 text-sm text-[#555555]">طلب المؤجر: {formatCurrency(compensation.ownerRequestedAmount ?? compensation.requestedAmount)} ر.ي</p>
        <p className="m-0 mt-1 text-sm text-[#555555]">اقتراحك: {formatCurrency(compensation.tenantProposedAmount ?? 0)} ر.ي</p>
        {compensation.dispute?.tenant_claim ? (
          <p className="m-0 mt-1 text-sm text-[#555555]">اعتراضك: {compensation.dispute.tenant_claim}</p>
        ) : null}
      </div>
    );
  }

  if (!isPendingTenant) return null;

  return (
    <div className="mb-4 rounded-xl border-2 border-[#E67E22] bg-white p-5">
      <h4 className="m-0 mb-4 text-base font-bold text-[#222222]">مطالبة تعويض من المؤجر</h4>

      <div className="mb-4 rounded-lg bg-[#FEF9F0] p-3 text-sm leading-7 text-[#222222]">
        <p className="m-0">
          <strong>قيمة الخصم المطلوب:</strong> {formatCurrency(compensation.requestedAmount)} ر.ي
        </p>
        {compensation.finalCondition ? (
          <p className="m-0 mt-2">
            <strong>حالة المعدة عند الإرجاع:</strong> {CONDITION_LABELS[compensation.finalCondition] || compensation.finalCondition}
          </p>
        ) : null}
        <p className="m-0 mt-2">
          <strong>سبب المطالبة:</strong> {compensation.notes || 'لم يكتب المؤجر ملاحظات إضافية.'}
        </p>
        {compensation.evidencePhotos?.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {compensation.evidencePhotos.map((photo, index) => (
              canRenderPhoto(photo) ? (
                <img
                  key={`${photo}-${index}`}
                  src={photo}
                  alt={`صورة ${index + 1}`}
                  className="h-20 w-20 rounded-md object-cover"
                />
              ) : (
                <span
                  key={`${photo}-${index}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#555555]"
                >
                  {photo}
                </span>
              )
            ))}
          </div>
        ) : null}
      </div>

      {!showDisputeForm ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl bg-[#27AE60] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#219A52]"
            onClick={onAccept}
          >
            ✅ قبول التعويض
          </button>
          <button
            type="button"
            className="rounded-xl bg-[#F39C12] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D68910]"
            onClick={() => setShowDisputeForm(true)}
          >
            ⚖️ فتح نزاع
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="m-0 text-sm font-bold text-[#222222]">اكتب اعتراضك بوضوح ليصل للإدارة مع بيانات العملية:</p>
          <textarea
            placeholder="مثال: أرفض الخصم لأن التلف كان موجوداً قبل الاستلام، أو لأن الصور لا تثبت سوء الاستخدام..."
            rows={3}
            value={tenantClaim}
            onChange={(event) => setTenantClaim(event.target.value)}
            className="w-full resize-none rounded-lg border border-[#DDDDDD] p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          />
          <input
            type="number"
            placeholder="القيمة التي تقبل بها إن وجدت (ر.ي) - اختياري"
            value={disputeAmount}
            onChange={(event) => setDisputeAmount(event.target.value)}
            className="rounded-lg border border-[#DDDDDD] p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-xl bg-[#E74C3C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#C0392B]"
              onClick={() => {
                if (!tenantClaim.trim()) return;
                onOpenDispute(tenantClaim.trim(), Number(disputeAmount || 0));
              }}
            >
              تأكيد فتح النزاع
            </button>
            <button
              type="button"
              className="rounded-xl border border-[#E0E0E0] px-4 py-2 text-sm font-bold text-[#555555] transition-colors hover:bg-[#F4F6F9]"
              onClick={() => setShowDisputeForm(false)}
            >
              إلغاء
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
