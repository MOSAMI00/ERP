import React, { useMemo, useState } from 'react';
import { CheckCircle2, FileSignature } from 'lucide-react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import { AppButton } from '../../../../components/shared';
import DetailsModal from '../../../../components/shared/DetailsModal';
import { ContractBody } from '../../../../features/contracts/ui/ContractBody';
import {
  equipmentOf,
  tenantOf,
  UNKNOWN_EQUIPMENT,
  UNKNOWN_USER,
} from '../requestHelpers';

const contractText = (rental) => (
  rental?.contract?.contract_body
  ?? rental?.contract?.contractBody
  ?? [
    `عقد تأجير معدة: ${equipmentOf(rental).name ?? UNKNOWN_EQUIPMENT}`,
    `رقم العملية: #${rental?.id ?? '—'}`,
    `المستأجر: ${tenantOf(rental).name ?? tenantOf(rental).full_name ?? UNKNOWN_USER}`,
    `فترة التأجير: من ${rental?.start_date ?? rental?.startDate ?? '—'} إلى ${rental?.end_date ?? rental?.endDate ?? '—'}`,
    `إجمالي المبلغ: ${rental?.total_amount ?? rental?.totalAmount ?? 0} ر.ي`,
  ].join('\n')
);

const AcceptRequestModal = ({ isOpen, rental, onClose, onConfirm }) => {
  const [signed, setSigned] = useState(false);
  const tenant = tenantOf(rental);
  const equipment = equipmentOf(rental);
  const body = useMemo(() => contractText(rental), [rental]);
  const timeSlotLabels = {
    morning: 'صباحاً (8ص - 12م)',
    afternoon: 'ظهراً (12م - 4م)',
    evening: 'مساءً (4م - 8م)',
  };
  const preferredTime = timeSlotLabels[rental?.preferred_time_slot ?? rental?.preferredTimeSlot]
    ?? rental?.delivery_time
    ?? rental?.deliveryTime
    ?? '—';

  if (!rental) return null;

  return (
    <DetailsModal
      isOpen={isOpen}
      title={`مراجعة وقبول الطلب #${rental.orderNum ?? rental.id ?? '—'}`}
      description="راجع بيانات طلب التأجير والعقد، ثم وقّع إلكترونياً قبل إرسال القبول للمستأجر."
      onClose={onClose}
      maxWidth={760}
      footer={(
        <div className="flex-center gap-4" style={{ width: '100%' }}>
          <AppButton variant="outline" style={{ flex: 1 }} onClick={onClose}>إلغاء</AppButton>
          <AppButton variant="success" style={{ flex: 1 }} disabled={!signed} onClick={onConfirm}>
            <CheckCircle2 size={16} /> توقيع وقبول الطلب
          </AppButton>
        </div>
      )}
    >
      <div className="owner-grid-2 mb-6">
        <div><span className="text-muted">المستأجر:</span><br /><strong>{tenant.name ?? tenant.full_name ?? UNKNOWN_USER}</strong></div>
        <div><span className="text-muted">المعدة:</span><br /><strong>{equipment.name ?? UNKNOWN_EQUIPMENT}</strong></div>
        <div><span className="text-muted">الفترة:</span><br /><strong>{formatRentalDateRange(rental.start_date ?? rental.startDate ?? '', rental.end_date ?? rental.endDate ?? '')}</strong></div>
        <div><span className="text-muted">موقع الاستلام:</span><br /><strong>{rental.delivery_location ?? rental.deliveryLocation ?? equipment.location ?? '—'}</strong></div>
        <div><span className="text-muted">الوقت المفضل للاستلام:</span><br /><strong>{preferredTime}</strong></div>
      </div>

      <div className="owner-card mb-5" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <div className="flex-between mb-2"><span>الإيجار</span><span>{formatCurrency(rental.rental_amount ?? rental.rentalAmount ?? 0)} ر.ي</span></div>
        <div className="flex-between mb-2"><span>التأمين</span><span>{formatCurrency(rental.insurance_amount ?? rental.insuranceAmount ?? 0)} ر.ي</span></div>
        <div className="flex-between" style={{ fontWeight: 700 }}><span>الإجمالي</span><span>{formatCurrency(rental.total_amount ?? rental.totalAmount ?? 0)} ر.ي</span></div>
      </div>

      <div className="owner-card mb-5" style={{ boxShadow: 'none' }}>
        <h4 className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginTop: 0 }}>
          <FileSignature size={18} /> العقد
        </h4>
        <ContractBody body={body} />
      </div>

      <label className="flex-center gap-3" style={{ justifyContent: 'flex-start', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={signed}
          onChange={(event) => setSigned(event.target.checked)}
        />
        <span>أقر بأنني راجعت بيانات الطلب والعقد وأوافق على توقيعه إلكترونياً.</span>
      </label>
    </DetailsModal>
  );
};

export default AcceptRequestModal;
