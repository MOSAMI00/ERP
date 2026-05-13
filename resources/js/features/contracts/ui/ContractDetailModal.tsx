import React from 'react';

export function ContractDetailModal({ contract, config, onClose }) {
  if (!contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="m-0 text-xl font-bold text-[#222222]">
              عقد التأجير
            </h2>
            <p className="m-0 mt-1 text-sm text-[#888888]">
              {contract.number}
            </p>
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
            <p className="m-0 text-[#888888]">
              {config.partnerColumnHeader}
            </p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {contract.partnerName}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">المعدة</p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {contract.equipment}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">
              {config.amountColumnHeader}
            </p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {contract.amount}
            </p>
          </div>
          <div className="rounded-xl bg-[#F8FAFC] p-4">
            <p className="m-0 text-[#888888]">
              {config.statusColumnHeader}
            </p>
            <p className="m-0 mt-1 font-bold text-[#222222]">
              {contract.statusLabel || contract.status}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm leading-7 text-[#555555]">
          هذه معاينة قراءة فقط لبيانات العقد الحالية. إجراءات التسليم
          والإرجاع والنزاعات تبقى داخل صفحات workflow الخاصة بها.
        </div>
      </div>
    </div>
  );
}
