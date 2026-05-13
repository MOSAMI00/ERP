import { visit } from '../../../../../inertia/navigation';

import { STATUS_CONFIG } from '../../../../../entities/rental';



function ActionButton({ rental, readyForDelivery }) {
  
  const { status, id } = rental;

  if (status === 'pending') {
    return (
      <button
        onClick={() => visit(`/dashboard/order/${id}`)}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ color: '#F39C12', backgroundColor: 'transparent', border: '1px solid #F39C12' }}
      >
        بانتظار الموافقة
      </button>
    );
  }

  if (status === 'confirmed' && rental.paymentStatus === 'unpaid') {
    return (
      <button
        onClick={() => visit(`/dashboard/order/${id}`)}
        className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{ color: '#FFFFFF', backgroundColor: '#F39C12' }}
      >
        إتمام الدفع
      </button>
    );
  }

  const configs: Partial<Record<Status, { label: string; color: string; bg: string; onClick: () => void }>> = {
    confirmed: {
      label: readyForDelivery ? 'جاهز للاستلام؟' : 'عرض التفاصيل',
      color: '#FFFFFF',
      bg: '#2D5A27',
      onClick: () => visit(readyForDelivery ? `/dashboard/order/${id}/delivery` : `/dashboard/order/${id}`),
    },
    in_use: { label: 'التسليم والإرجاع', color: '#FFFFFF', bg: '#3498DB', onClick: () => visit(`/dashboard/order/${id}/delivery`) },
    completed: { label: 'قيّم', color: '#FFFFFF', bg: '#27AE60', onClick: () => visit(`/dashboard/ratings?orderId=${id}`) },
    disputed: { label: 'عرض النزاع', color: '#FFFFFF', bg: '#E74C3C', onClick: () => visit(`/dashboard/order/${id}/delivery`) },
  };
  const config = configs[status];
  if (!config) return null;
  return (
    <button
      onClick={config.onClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
      style={{ color: config.color, backgroundColor: config.bg, border: config.bg === 'transparent' ? `1px solid ${config.color}` : 'none' }}
    >
      {config.label}
    </button>
  );
}

export function OrderCard({ rental }) {
  
  const st = STATUS_CONFIG[rental.status];
  const equipment = getEquipmentSnapshot(rental.equipmentId);
  const paymentLabel = rental.paymentStatus === 'paid' ? 'مدفوع' : rental.paymentStatus === 'refunded' ? 'مسترد' : 'غير مدفوع';
  const paymentColor = rental.paymentStatus === 'paid' ? '#27AE60' : rental.paymentStatus === 'refunded' ? '#95A5A6' : '#F39C12';
  const readyForDelivery = rental.status === 'confirmed' && isRentalStartingSoon(rental);

  return (
    <div
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={() => visit(`/dashboard/order/${rental.id}`)}
    >
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="w-[72px] h-[72px] rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] overflow-hidden flex-shrink-0">
          <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[#222222] text-base leading-tight">{equipment.name}</h3>
            <span className="text-xs text-[#888888] font-mono whitespace-nowrap">#{rental.orderNum}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-[#888888]">👤 {equipment.ownerName}</span>
            <span className="text-[#E0E0E0]">|</span>
            <span className="text-sm text-[#F39C12]">⭐ {equipment.ownerRating}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E0E0E0] mx-4" />
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-[#888888]">
          <span>📅</span>
          <span>{formatRentalDateRange(rental.startDate, rental.endDate)}</span>
          <span className="text-[#2D5A27] font-medium">({rental.durationDays} أيام)</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#222222]">
          <span className="text-sm">💰</span>
          <span>{formatCurrency(rental.totalAmount)} ر.ي</span>
        </div>
      </div>
      <div className="px-4 pb-3 flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-[#F4F6F9] text-[#555555]">
          مدة الإيجار: {rental.durationDays} أيام
        </span>
        <span className="px-2.5 py-1 rounded-full bg-[#F4F6F9]" style={{ color: paymentColor }}>
          الدفع: {paymentLabel}
        </span>
        {rental.status === 'disputed' && (
          <span className="px-2.5 py-1 rounded-full bg-[#FDEDEC] text-[#E74C3C] font-bold">
            عليه نزاع
          </span>
        )}
      </div>
      <div className="border-t border-[#E0E0E0] mx-4" />
      <div className="px-4 py-3 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ color: st.color, backgroundColor: st.bg }}
        >
          {st.label}
        </span>
        <ActionButton rental={rental} readyForDelivery={readyForDelivery} />
      </div>
    </div>
  );
}
