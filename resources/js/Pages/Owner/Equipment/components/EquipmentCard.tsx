import React from 'react';
import { Edit2, EyeOff, MapPin, Star, Trash2, Eye } from 'lucide-react';
import { router } from '@inertiajs/react';
import { AppButton, MoneyText, StatusBadge } from '../../../../components/shared';
import { visit } from '../../../../inertia/navigation';

const EquipmentCard = ({ equipment }) => {
  const isHidden = equipment.displayStatus === 'hidden' || equipment.status === 'hidden';

  const handleEdit = () => {
    visit(`/owner/equipment/${equipment.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذه المعدة؟')) {
      router.delete(`/equipment/${equipment.id}`);
    }
  };

  const handleToggleVisibility = () => {
    const newStatus = isHidden ? 'active' : 'hidden';
    router.patch(`/equipment/${equipment.id}`, {
      status: newStatus,
      // Pass existing data to satisfy UpdateEquipmentRequest if needed, 
      // but let's try sending just status first and see if controller handles it.
      // Actually, standard Laravel resource update might fail if required fields are missing.
      name: equipment.name,
      description: equipment.description || '—',
      governorate: equipment.location || '—',
      address: equipment.address || '—',
      price_per_day: equipment.dailyRate || 0,
      insurance_amount: equipment.insuranceAmount || 0,
      rental_terms: equipment.rentalTerms || '—',
    });
  };

  return (
    <div className="owner-card equipment-card" style={{ opacity: isHidden ? 0.6 : 1 }}>
      <img src={equipment.image} alt={equipment.name} className="equipment-image" />
      <div className="equipment-details">
        <div className="flex-between mb-2">
          <h3 className="equipment-title" style={{ margin: 0 }}>{equipment.name}</h3>
          <StatusBadge status={isHidden ? 'hidden' : 'active'} />
        </div>
        <div className="equipment-info-row"><MapPin size={14} /> {equipment.location}</div>
        <div className="equipment-info-row"><MoneyText value={equipment.dailyRate} /> ر.ي / اليوم</div>
        <div className="equipment-info-row">{equipment.rating ?? '—'} | {equipment.rentalCount ?? 0} تأجير</div>
        
        <div className="equipment-actions mt-4">
          <AppButton 
            variant="outline" 
            size="sm" 
            style={{ flex: 1, paddingInline: 0 }}
            onClick={handleEdit}
          >
            <Edit2 size={14} /> تعديل
          </AppButton>
          
          <AppButton 
            variant="outline" 
            size="sm" 
            style={{ flex: 1, paddingInline: 0, color: 'var(--color-disputed)' }}
            onClick={handleDelete}
          >
            <Trash2 size={14} /> حذف
          </AppButton>
          
          <AppButton 
            variant="outline" 
            size="sm" 
            style={{ 
              flex: 1, 
              paddingInline: 0, 
              color: isHidden ? 'var(--color-completed)' : undefined 
            }}
            onClick={handleToggleVisibility}
          >
            {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
            {isHidden ? ' إظهار' : ' إخفاء'}
          </AppButton>
        </div>
      </div>
    </div>
  );
};

export default EquipmentCard;
