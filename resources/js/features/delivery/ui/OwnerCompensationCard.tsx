import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { AppButton } from '../../../components/shared';

const COMPENSATION_STATUS_LABELS = {
  requested: 'بانتظار رد المستأجر',
  partial_refund: 'طلب خصم جزئي',
  no_refund: 'طلب خصم كامل مبلغ التأمين',
  full_refund: 'لا يوجد خصم من التأمين',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  disputed: 'تحول إلى نزاع',
  none: 'لا يوجد',
};

const CONDITION_LABELS = {
  excellent: 'ممتازة',
  good: 'جيدة',
  fair: 'متوسطة',
  damaged: 'متضررة',
  partially_damaged: 'متضررة جزئياً',
};

export function OwnerCompensationCard({
  compensation,
  form,
  onChange,
  onSubmit,
  loading = false,
}) {
  const hasDecision = compensation && (compensation.status && compensation.status !== 'none');

  if (hasDecision) {
    let statusLabel = COMPENSATION_STATUS_LABELS[compensation.status] || compensation.status;
    let badgeColor = '#B9770E';
    let bgColor = '#FFF9ED';
    let borderColor = '#F3C77B';

    if (compensation.rentalStatus === 'completed') {
      statusLabel = compensation.dispute?.status === 'resolved' ? 'تمت التسوية بقرار إداري' : 'تمت تسوية التعويض';
      badgeColor = '#27AE60';
      bgColor = '#F4FAF6';
      borderColor = '#D5E8D4';
    } else if (compensation.rentalStatus === 'disputed' || compensation.dispute) {
      statusLabel = 'تم الرفض وفتح نزاع ⚖️';
      badgeColor = '#E74C3C';
      bgColor = '#FDEDEC';
      borderColor = '#F5B7B1';
    }

    return (
      <div className={`mt-4 rounded-2xl border p-4 text-sm text-[#222222]`} style={{ backgroundColor: bgColor, borderColor: borderColor }}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-base font-bold text-[#222222]">مطالبة التعويض المسجلة</h3>
            <p className="m-0 mt-2 text-[#555555]">
              طلب المؤجر: <strong>{formatCurrency(compensation.ownerRequestedAmount ?? compensation.requestedAmount)} ر.ي</strong>
            </p>
            {compensation.dispute ? (
              <p className="m-0 mt-1 text-[#555555]">
                اقتراح المستأجر: <strong>{formatCurrency(compensation.tenantProposedAmount ?? 0)} ر.ي</strong>
              </p>
            ) : null}
            {compensation.rentalStatus === 'completed' ? (
              <p className="m-0 mt-1 text-[#555555]">
                المبلغ النهائي: <strong>{formatCurrency(compensation.finalAmount ?? compensation.requestedAmount)} ر.ي</strong>
              </p>
            ) : null}
            {compensation.finalCondition ? (
              <p className="m-0 mt-1 text-[#555555]">
                حالة المعدة عند الإرجاع: <strong>{CONDITION_LABELS[compensation.finalCondition] || compensation.finalCondition}</strong>
              </p>
            ) : null}
            {Number(compensation.lateFee || 0) > 0 ? (
              <p className="m-0 mt-1 text-[#555555]">
                رسوم التأخير المحتسبة: <strong>{formatCurrency(compensation.lateFee)} ر.ي</strong>
              </p>
            ) : null}
            <p className="m-0 mt-1 text-[#555555]">
              الحالة: <strong style={{ color: badgeColor }}>{statusLabel}</strong>
            </p>
          </div>
          <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: 'white', color: badgeColor, border: `1px solid ${badgeColor}` }}>
            {statusLabel}
          </span>
        </div>
        {compensation.notes ? (
          <p className="m-0 mt-3 leading-7 text-[#555555]">
            <strong>ملاحظات المؤجر:</strong> {compensation.notes}
          </p>
        ) : null}
        {compensation.dispute && (
          <div className="mt-3 rounded-lg bg-white/50 p-2 text-xs">
            <strong>حالة النزاع:</strong> {compensation.dispute.status === 'resolved' ? 'تمت التسوية من الإدارة' : 'النزاع قيد المراجعة الإدارية'}
            {compensation.dispute.adminNote ? <span> - {compensation.dispute.adminNote}</span> : null}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#F3C77B] bg-[#FFF9ED] p-4">
      <h3 className="m-0 text-base font-bold text-[#222222]">إرسال مطالبة تعويض</h3>
      <p className="m-0 mt-2 text-sm text-[#666666]">
        استخدم هذا النموذج فقط إذا أثبت تقرير الإرجاع وجود تلفيات أو خصم مستحق. ستظهر للمستأجر قيمة الخصم مع ملاحظاتك وصور تقرير الإرجاع.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <input
          type="number"
          value={form.amount}
          onChange={(event) => onChange('amount', event.target.value)}
          placeholder="قيمة الخصم المطلوب من التأمين (ر.ي)"
          className="h-11 rounded-xl border border-[#E0E0E0] bg-white px-3 text-sm focus:border-[#2D5A27] focus:outline-none"
        />
      </div>
      <textarea
        value={form.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        rows={3}
        placeholder="اشرح سبب الخصم: التلف، الجزء المتضرر، أو أي فرق موثق في تقرير الإرجاع..."
        className="mt-3 w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
      />

      <AppButton
        className="mt-3"
        disabled={loading || !Number(form.amount) || !form.notes.trim()}
        onClick={onSubmit}
      >
        {loading ? 'جاري الإرسال...' : 'إرسال طلب التعويض'}
      </AppButton>
    </div>
  );
}
