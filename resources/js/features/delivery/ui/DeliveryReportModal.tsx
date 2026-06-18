import React from 'react';
import { formatRentalDate } from '../../../utils/formatters';

const STATUS_LABELS = {
  excellent: 'ممتازة',
  good: 'جيدة',
  fair: 'متوسطة',
  damaged: 'تحتاج مراجعة',
  partially_damaged: 'تلفيات جزئية',
};

function imageUrl(image) {
  const path = image?.image_url ?? image?.url ?? image;
  if (!path || typeof path !== 'string') return null;
  if (/^(data:|blob:|https?:\/\/|\/)/.test(path)) return path;
  return `/storage/${path.replace(/^\/+/, '')}`;
}

export function DeliveryReportModal({ report, onClose }) {
  if (!report) return null;

  const role = report.submitted_by_role ?? report.submittedByRole;
  const status = report.condition_status ?? report.conditionStatus;
  const images = report.images ?? [];
  const notes = report.notes;
  const hasIssues = report.has_issues ?? report.hasIssues;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl font-bold text-[#222222]">
              {report.phase === 'delivery' ? 'تقرير التسليم' : 'تقرير الإرجاع'}
            </h2>
            <p className="m-0 mt-1 text-sm text-[#888888]">
              {formatRentalDate(report.created_at ?? report.createdAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E0E0E0] px-4 py-1.5 text-sm font-bold text-[#555555] hover:bg-[#F4F6F9] transition-colors"
          >
            إغلاق
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">تم بواسطة</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {role === 'owner' ? 'المؤجر' : 'المستأجر'}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">حالة المعدة</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {STATUS_LABELS[status] || (hasIssues ? 'توجد تلفيات' : 'لا توجد تلفيات')}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
            <p className="m-0 text-[#888888]">الملاحظات</p>
            <p className="m-0 mt-1 font-bold text-[#222222] whitespace-pre-wrap">
              {notes || 'لا توجد ملاحظات'}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
            <p className="m-0 text-[#888888] mb-3">الصور التوثيقية</p>
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {images.map((img, idx) => {
                  const src = imageUrl(img);
                  if (!src) return null;

                  return (
                    <div key={idx} className="aspect-square rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                      <img
                        src={src}
                        className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform"
                        alt={`صورة توثيق ${idx + 1}`}
                        onClick={() => window.open(src, '_blank')}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="m-0 mt-1 font-bold text-[#222222]">لا توجد صور مرفقة</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
