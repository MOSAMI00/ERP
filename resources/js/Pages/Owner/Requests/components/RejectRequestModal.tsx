import React, { useState } from 'react';
import { AppButton, AppSelect, AppTextarea } from '../../../../components/shared';
import DetailsModal from '../../../../components/shared/DetailsModal';

const RejectRequestModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('المعدة غير متاحة في هذا التاريخ');
  const [notes, setNotes] = useState('');
  const [isSure, setIsSure] = useState(false);

  return (
    <DetailsModal
      isOpen={isOpen}
      title="رفض الطلب"
      description="هل أنت متأكد من رفض هذا الطلب؟ سيتم إشعار المستأجر وإلغاء الطلب."
      onClose={onClose}
      maxWidth={450}
      footer={(
        <>
          <AppButton variant="outline" onClick={onClose}>إلغاء</AppButton>
          <AppButton
            variant="danger"
            disabled={!isSure}
            onClick={() => onConfirm([reason, notes].filter(Boolean).join(' - '))}
          >
            نعم، رفض الطلب
          </AppButton>
        </>
      )}
    >
      <div className="mb-4">
        <label className="owner-label">سبب الرفض</label>
        <AppSelect className="mb-4" value={reason} onChange={(event) => setReason(event.target.value)}>
          <option>المعدة غير متاحة في هذا التاريخ</option>
          <option>الموقع بعيد جداً</option>
          <option>تقييم المستأجر منخفض</option>
          <option>سبب آخر</option>
        </AppSelect>
      </div>
      <div className="mb-4">
        <label className="owner-label">ملاحظات إضافية</label>
        <AppTextarea rows={3} placeholder="سبب إضافي..." value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>
      <label className="flex-center gap-3" style={{ justifyContent: 'flex-start', cursor: 'pointer' }}>
        <input type="checkbox" checked={isSure} onChange={(event) => setIsSure(event.target.checked)} />
        <span>أؤكد أنني أريد رفض الطلب.</span>
      </label>
    </DetailsModal>
  );
};

export default RejectRequestModal;
