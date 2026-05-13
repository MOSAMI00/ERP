import React from 'react';
import { EmptyState } from '../../../../components/shared';
import { EquipmentCardSkeleton } from '../../../../components/shared/OwnerSkeletons';
import RequestCard from './RequestCard';

const RequestGrid = ({ isLoading, rentals, search, onOpenModal }) => {
  if (isLoading) {
    return (
      <div className="owner-grid-2">
        <EquipmentCardSkeleton />
        <EquipmentCardSkeleton />
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <EmptyState
        type={search ? 'noResults' : 'empty'}
        icon="📭"
        title="لا توجد طلبات مطابقة"
        description="ستظهر هنا طلبات الحجز الجديدة عند إرسالها من المستأجرين."
      />
    );
  }

  return (
    <div className="owner-grid-2">
      {rentals.map((rental) => (
        <RequestCard key={rental.id} rental={rental} onOpenModal={onOpenModal} />
      ))}
    </div>
  );
};

export default RequestGrid;
