import React from 'react';
import { formatRentalDate } from '../../../utils/formatters';

export function DeliveryReportModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl font-bold text-[#222222]">
              {report.phase === 'delivery' ? 'تقرير التسليم' : 'تقرير الإرجاع'}
            </h2>
            <p className="m-0 mt-1 text-sm text-[#888888]">{formatRentalDate(report.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E0E0E0] px-3 py-1 text-sm font-bold text-[#555555] hover:bg-[#F4F6F9]"
          >
            إغلاق
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">تم بواسطة</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {report.submittedByRole === 'owner' ? 'المؤجر' : 'المستأجر'}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">حالة المعدة</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {report.conditionStatus || (report.hasDamage ? 'توجد تلفيات' : 'لا توجد تلفيات')}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
            <p className="m-0 text-[#888888]">الملاحظات</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">{report.notes || 'لا توجد ملاحظات'}</p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
            <p className="m-0 text-[#888888]">الصور</p>
            {report.evidencePhotos?.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {report.evidencePhotos.map((photo) => (
                  <span key={photo} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#555555]">
                    {photo}
                  </span>
                ))}
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
