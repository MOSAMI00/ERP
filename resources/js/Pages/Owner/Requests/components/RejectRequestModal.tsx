import React from 'react';
import { AppButton, AppSelect, AppTextarea } from '../../../../components/shared';
import DetailsModal from '../../../../components/shared/DetailsModal';

const RejectRequestModal = ({ isOpen, onClose, onConfirm }) => (
  <DetailsModal
    isOpen={isOpen}
    title="رفض الطلب"
    onClose={onClose}
    maxWidth={450}
    footer={(
      <>
        <AppButton variant="outline" onClick={onClose}>إلغاء</AppButton>
        <AppButton variant="danger" onClick={onConfirm}>تأكيد الرفض</AppButton>
      </>
    )}
  >
    <div className="mb-4">
      <label className="owner-label">سبب الرفض</label>
      <AppSelect className="mb-4">
        <option>المعدة غير متاحة في هذا التاريخ</option>
        <option>الموقع بعيد جداً</option>
        <option>تقييم المستأجر منخفض</option>
        <option>سبب آخر</option>
      </AppSelect>
    </div>
    <div className="mb-4">
      <label className="owner-label">ملاحظات إضافية</label>
      <AppTextarea rows={3} placeholder="سبب إضافي..." />
    </div>
  </DetailsModal>
);

export default RejectRequestModal;
