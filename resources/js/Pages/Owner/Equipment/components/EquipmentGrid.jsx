import React from 'react';
import { Plus } from 'lucide-react';
import { AppButton, EmptyState } from '../../../../components/shared';
import { EquipmentCardSkeleton } from '../../../../components/shared/OwnerSkeletons';
import EquipmentCard from './EquipmentCard';

const EquipmentGrid = ({ isLoading, equipment, onAddEquipment }) => {
  if (isLoading) {
    return (
      <div className="owner-grid-3">
        <EquipmentCardSkeleton />
        <EquipmentCardSkeleton />
        <EquipmentCardSkeleton />
      </div>
    );
  }

  if (equipment.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="لا توجد معدات مطابقة"
        description="جرّب تغيير البحث أو الفلاتر، أو أضف معدة جديدة."
      >
        <AppButton onClick={onAddEquipment}>
          <Plus size={18} /> إضافة أول معدة
        </AppButton>
      </EmptyState>
    );
  }

  return (
    <div className="owner-grid-3">
      {equipment.map((item) => (
        <EquipmentCard key={item.equipmentId} equipment={item} />
      ))}
    </div>
  );
};

export default EquipmentGrid;
