import React from 'react';
import { Eye } from 'lucide-react';
import { AppButton } from '../../../../components/shared';

const RequestDecisionActions = ({ rental, onOpenModal }) => {
  if (rental?.status !== 'pending') {
    return (
      <AppButton variant="outline" className="w-full" onClick={() => onOpenModal('detail', rental?.id)}>
        <Eye size={16} /> عرض التفاصيل
      </AppButton>
    );
  }

  return (
    <div className="flex-center gap-4">
      <AppButton variant="danger" style={{ flex: 1 }} onClick={() => onOpenModal('reject', rental.id)}>
        رفض
      </AppButton>
      <AppButton variant="success" style={{ flex: 1 }} onClick={() => onOpenModal('accept', rental.id)}>
        قبول الطلب
      </AppButton>
    </div>
  );
};

export default RequestDecisionActions;
