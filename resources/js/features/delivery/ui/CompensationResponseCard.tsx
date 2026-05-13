import { useState } from 'react';
import { formatCurrency } from '../../../utils/formatters';

function canRenderPhoto(photo) {
  return /^(data:|blob:|https?:\/\/|\/)/.test(photo);
}

export function CompensationResponseCard({
  compensation,
  onAccept,
  onReject,
  onOpenDispute,
}) {
  const [tenantClaim, setTenantClaim] = useState('');
  const [disputeAmount, setDisputeAmount] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  if (compensation.status !== 'requested') return null;

  return (
    <div className="mb-4 rounded-xl border-2 border-[#E67E22] bg-white p-5">
      <h4 className="m-0 mb-4 text-base font-bold text-[#222222]">⚠️ طلب تعويض من المؤجر</h4>

      <div className="mb-4 rounded-lg bg-[#FEF9F0] p-3 text-sm leading-7 text-[#222222]">
        <p className="m-0">
          <strong>المبلغ المطالب به:</strong> {formatCurrency(compensation.requestedAmount)} ر.ي
        </p>
        <p className="m-0 mt-2">
          <strong>ملاحظات المؤجر:</strong> {compensation.notes}
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
            className="rounded-xl bg-[#E74C3C] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#C0392B]"
            onClick={onReject}
          >
            ❌ رفض
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
          <p className="m-0 text-sm font-bold text-[#222222]">أدخل تفاصيل النزاع:</p>
          <textarea
            placeholder="موقفك من المطالبة وأسباب اعتراضك..."
            rows={3}
            value={tenantClaim}
            onChange={(event) => setTenantClaim(event.target.value)}
            className="w-full resize-none rounded-lg border border-[#DDDDDD] p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          />
          <input
            type="number"
            placeholder="القيمة المقترحة أو المطالب بها (ر.ي) - اختياري"
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
