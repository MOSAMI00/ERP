import React from 'react';
import { formatCurrency } from '../../../utils/formatters';
import { AppButton } from '../../../components/shared';

const COMPENSATION_STATUS_LABELS = {
  requested: 'بانتظار رد المستأجر',
  accepted: 'مقبول',
  rejected: 'مرفوض',
  disputed: 'تحول إلى نزاع',
  none: 'لا يوجد',
};

export function OwnerCompensationCard({
  compensation,
  form,
  onChange,
  onSubmit,
}) {
  if (compensation) {
    return (
      <div className="mt-4 rounded-2xl border border-[#F3C77B] bg-[#FFF9ED] p-4 text-sm text-[#222222]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="m-0 text-base font-bold text-[#222222]">طلب التعويض</h3>
            <p className="m-0 mt-2 text-[#555555]">
              المبلغ المطالب به: <strong>{formatCurrency(compensation.requestedAmount)} ر.ي</strong>
            </p>
            <p className="m-0 mt-1 text-[#555555]">
              الحالة: <strong>{COMPENSATION_STATUS_LABELS[compensation.status] || compensation.status}</strong>
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-[#B9770E]">
            {COMPENSATION_STATUS_LABELS[compensation.status] || compensation.status}
          </span>
        </div>
        {compensation.notes ? (
          <p className="m-0 mt-3 leading-7 text-[#555555]">{compensation.notes}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-2xl border border-[#F3C77B] bg-[#FFF9ED] p-4">
      <h3 className="m-0 text-base font-bold text-[#222222]">طلب تعويض</h3>
      <p className="m-0 mt-2 text-sm text-[#666666]">
        بعد تأكيد الإرجاع يمكنك إرسال مطالبة منفصلة للمستأجر مع المبلغ والملاحظات والصور.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <input
          type="number"
          value={form.amount}
          onChange={(event) => onChange('amount', event.target.value)}
          placeholder="المبلغ المطالب به (ر.ي)"
          className="h-11 rounded-xl border border-[#E0E0E0] bg-white px-3 text-sm focus:border-[#2D5A27] focus:outline-none"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => onChange('photos', Array.from(event.target.files || []).map((file) => file.name))}
          className="block w-full rounded-xl border border-dashed border-[#F3C77B] bg-white px-3 py-2 text-sm"
        />
      </div>
      <textarea
        value={form.notes}
        onChange={(event) => onChange('notes', event.target.value)}
        rows={3}
        placeholder="ملاحظات وتفاصيل التعويض..."
        className="mt-3 w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
      />

      <AppButton
        className="mt-3"
        disabled={!Number(form.amount) || !form.notes.trim()}
        onClick={onSubmit}
      >
        إرسال طلب التعويض
      </AppButton>
    </div>
  );
}
