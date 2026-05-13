import React from 'react';
import { Edit2, EyeOff, MapPin, Star, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { AppButton, MoneyText, StatusBadge } from '../../../../components/shared';

const EquipmentCard = ({ equipment }) => (
  <div className="owner-card equipment-card" style={{ opacity: equipment.displayStatus === 'hidden' ? 0.6 : 1 }}>
    <img src={equipment.image} alt={equipment.name} className="equipment-image" />
    <div className="equipment-details">
      <div className="flex-between mb-2">
        <h3 className="equipment-title" style={{ margin: 0 }}>{equipment.name}</h3>
        <StatusBadge status={equipment.displayStatus} />
      </div>
      <div className="equipment-info-row"><MapPin size={14} /> {equipment.location}</div>
      <div className="equipment-info-row"><MoneyText value={equipment.dailyRate} /> ر.ي / اليوم</div>
      <div className="equipment-info-row">{equipment.rating ?? '—'} | {equipment.rentalCount} تأجير</div>
      <div className="equipment-actions">
        <AppButton variant="outline" size="sm" style={{ flex: 1, paddingInline: 0 }}><Edit2 size={14} /> تعديل</AppButton>
        <AppButton variant="outline" size="sm" style={{ flex: 1, paddingInline: 0, color: 'var(--color-disputed)' }}><Trash2 size={14} /> حذف</AppButton>
        <AppButton variant="outline" size="sm" style={{ flex: 1, paddingInline: 0, color: equipment.displayStatus === 'hidden' ? 'var(--color-completed)' : undefined }}>
          {equipment.displayStatus === 'hidden' ? <Star size={14} /> : <EyeOff size={14} />}
          {equipment.displayStatus === 'hidden' ? ' إظهار' : ' إخفاء'}
        </AppButton>
      </div>
    </div>
  </div>
);

export default EquipmentCard;
