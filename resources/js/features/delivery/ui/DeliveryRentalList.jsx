import React from 'react';
import { StatusBadge } from '../../../components/shared';

const STATUS_META = {
  confirmed: { label: 'بانتظار التسليم', color: '#2D5A27', bg: '#EAF3E9' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: 'rgba(230,126,34,0.12)' },
  disputed: { label: 'نزاع مفتوح', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
};

const STAGE_META = {
  delivery: { label: 'بانتظار التسليم', status: 'confirmed' },
  handover: { label: 'قيد التسليم', status: 'confirmed' },
  in_use: { label: 'قيد الاستخدام', status: 'in_use' },
  return: { label: 'بانتظار الإرجاع', status: 'in_use' },
  disputes: { label: 'نزاع مفتوح', status: 'disputed' },
  completed: { label: 'مكتمل', status: 'completed' },
};

export function DeliveryRentalList({ rentals, selectedRental, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      {rentals.map((rental) => (
        <button
          key={rental.id}
          type="button"
          onClick={() => onSelect(rental.id)}
          className={`w-full rounded-2xl border bg-white p-4 text-right transition-all ${
            selectedRental?.id === rental.id
              ? 'border-[#2D5A27] shadow-md'
              : 'border-[#E0E0E0] hover:border-[#B8CDB4]'
          }`}
        >
          <div className="flex items-center gap-3">
            <img
              src={rental.equipment.image}
              alt={rental.equipment.name}
              className="h-16 w-16 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-sm font-bold text-[#222222]">{rental.equipment.name}</p>
              <p className="m-0 mt-1 text-xs text-[#888888]">{rental.orderNum} • {rental.partnerName}</p>
            </div>
            <StatusBadge status={STAGE_META[rental.workflowStage]?.status} meta={{
              ...STATUS_META[STAGE_META[rental.workflowStage]?.status],
              label: STAGE_META[rental.workflowStage]?.label,
            }} />
          </div>
        </button>
      ))}
    </div>
  );
}
