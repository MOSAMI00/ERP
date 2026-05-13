import React from 'react';
import { formatCurrency } from '../../../../utils/formatters';
import { AppButton } from '../../../../components/shared';
import DetailsModal from '../../../../components/shared/DetailsModal';
import {
  equipmentOf,
  statusConfig,
  tenantOf,
  UNKNOWN_EQUIPMENT,
  UNKNOWN_STATUS,
  UNKNOWN_USER,
} from '../requestHelpers';

const RequestDetailsModal = ({ isOpen, rental, onClose }) => {
  const equipment = equipmentOf(rental);
  const tenant = tenantOf(rental);
  const status = statusConfig(rental?.status);

  return (
    <DetailsModal
      isOpen={isOpen}
      title={`تفاصيل الطلب #${rental?.orderNum ?? '—'}`}
      onClose={onClose}
      footer={<AppButton variant="outline" onClick={onClose}>إغلاق</AppButton>}
    >
      <div className="owner-grid-2 mb-6">
        <div><span className="text-muted">المستأجر:</span><br /><strong>{tenant.name ?? UNKNOWN_USER}</strong></div>
        <div><span className="text-muted">الهاتف:</span><br /><strong style={{ direction: 'ltr', display: 'inline-block' }}>{tenant.phone ?? '—'}</strong></div>
        <div><span className="text-muted">الحالة:</span><br /><strong>{status.label ?? UNKNOWN_STATUS}</strong></div>
        <div><span className="text-muted">الدفع:</span><br /><strong>{rental?.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}</strong></div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
      <div className="mb-4">
        <span className="text-muted">المعدة:</span> <strong>{equipment.name ?? UNKNOWN_EQUIPMENT}</strong>
      </div>
      <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <div className="flex-between mb-2"><span>الإيجار</span><span>{formatCurrency(rental?.rentalAmount ?? 0)} ر.ي</span></div>
        <div className="flex-between mb-2"><span>رسوم الخدمة</span><span>{formatCurrency(rental?.serviceFee ?? 0)} ر.ي</span></div>
        <div className="flex-between mb-2"><span>مبلغ التأمين</span><span>{formatCurrency(rental?.insuranceAmount ?? 0)} ر.ي</span></div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
        <div className="flex-between" style={{ fontWeight: 700 }}><span>الإجمالي</span><span>{formatCurrency(rental?.totalAmount ?? 0)} ر.ي</span></div>
      </div>
    </DetailsModal>
  );
};

export default RequestDetailsModal;
