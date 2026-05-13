import React from 'react';
import RentalDetailsPanel from './RentalDetailsPanel';
import RentalTimeline from './RentalTimeline';

const RentalSelectionDetails = ({
  rental,
  equipment,
  tenant,
  handovers,
  timeline,
  onClose,
}) => {
  if (!rental || !equipment) return null;

  return (
    <div>
      <div className="flex-between mb-4">
        <h3 style={{ margin: 0 }}>تفاصيل العملية #{rental.orderNum}</h3>
        <button className="owner-btn owner-btn-outline" style={{ fontSize: 12 }} onClick={onClose} type="button">
          إغلاق
        </button>
      </div>
      <div className="owner-grid-2">
        <RentalDetailsPanel
          rental={rental}
          equipment={equipment}
          tenant={tenant}
          handovers={handovers}
        />
        <RentalTimeline steps={timeline} />
      </div>
    </div>
  );
};

export default RentalSelectionDetails;
