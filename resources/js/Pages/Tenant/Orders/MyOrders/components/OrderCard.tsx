import React from 'react';
import { router } from '@inertiajs/react';
import { STATUS_CONFIG } from '../../../../../entities/rental';
import { formatCurrency, formatRentalDateRange, isRentalStartingSoon } from '../../../../../utils/formatters';

function ActionButton({ rental, readyForDelivery }) {
  const { status, id } = rental;

  const handleVisit = (e, url) => {
    e.stopPropagation();
    router.visit(url);
  };

  if (status === 'pending') {
    return (
      <button
        onClick={(e) => handleVisit(e, `/rentals/${id}`)}
        className="px-4 py-2 rounded-lg text-sm font-semibold border border-warning text-warning hover:bg-warning/5 transition-all"
      >
        بانتظار الموافقة
      </button>
    );
  }

  if (status === 'confirmed' && rental.payment_status === 'unpaid') {
    return (
      <button
        onClick={(e) => handleVisit(e, `/rentals/${id}`)}
        className="px-4 py-2 rounded-lg text-sm font-semibold bg-warning text-white hover:bg-warning/90 transition-all"
      >
        إتمام الدفع
      </button>
    );
  }

  const configs = {
    confirmed: {
      label: readyForDelivery ? 'جاهز للاستلام؟' : 'عرض التفاصيل',
      color: '#FFFFFF',
      bg: '#2D5A27',
      onClick: (e) => handleVisit(e, readyForDelivery ? `/handover/create/${id}?phase=delivery` : `/rentals/${id}`),
    },
    in_use: { 
      label: 'التسليم والإرجاع', 
      color: '#FFFFFF', 
      bg: '#3498DB', 
      onClick: (e) => handleVisit(e, `/rentals/${id}`) 
    },
    completed: { 
      label: 'عرض الطلب', 
      color: '#FFFFFF', 
      bg: '#27AE60', 
      onClick: (e) => handleVisit(e, `/rentals/${id}`) 
    },
    disputed: { 
      label: 'عرض النزاع', 
      color: '#FFFFFF', 
      bg: '#E74C3C', 
      onClick: (e) => handleVisit(e, `/rentals/${id}`) 
    },
  };

  const config = configs[status];
  if (!config) return null;

  return (
    <button
      onClick={config.onClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </button>
  );
}

export function OrderCard({ rental }) {
  const st = STATUS_CONFIG[rental.status] || { label: rental.status, color: '#888', bg: '#eee' };
  const equipment = rental.equipment || {};
  const owner = equipment.owner || rental.owner || {};
  
  const isPaid = ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status) || 
                (rental.payments && rental.payments.some(p => p.status === 'paid'));
  const paymentLabel = isPaid ? 'مدفوع' : (rental.payment_status === 'refunded' ? 'مسترد' : 'غير مدفوع');
  const paymentColor = isPaid ? '#27AE60' : (rental.payment_status === 'refunded' ? '#95A5A6' : '#F39C12');
  const readyForDelivery = rental.status === 'paid' && isRentalStartingSoon(rental);

  const primaryImage = equipment.images?.[0]?.image_url || '/placeholder-equipment.png';

  return (
    <div
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={() => router.visit(`/rentals/${rental.id}`)}
    >
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="w-[72px] h-[72px] rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] overflow-hidden flex-shrink-0">
          <img src={primaryImage} alt={equipment.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[#222222] text-base leading-tight truncate">{equipment.name || 'معدة غير معروفة'}</h3>
            <span className="text-xs text-[#888888] font-mono whitespace-nowrap">#{rental.id}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-[#888888]">👤 {owner.full_name || owner.name || 'مالك غير معروف'}</span>
            <span className="text-[#E0E0E0]">|</span>
            <span className="text-sm text-[#F39C12]">⭐ {owner.rating || '0.0'}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E0E0E0] mx-4" />
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-[#888888]">
          <span className="text-xs">📅</span>
          <span className="text-xs">{formatRentalDateRange(rental.start_date, rental.end_date)}</span>
          <span className="text-[#2D5A27] font-bold text-xs">({rental.duration_days} أيام)</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#222222]">
          <span className="text-sm">💰</span>
          <span className="text-sm">{formatCurrency(rental.total_amount)} ر.ي</span>
        </div>
      </div>
      <div className="px-4 pb-3 flex flex-wrap gap-2 text-xs">
        <span className="px-2.5 py-1 rounded-full bg-[#F4F6F9] text-[#555555]">
          المدة: {rental.duration_days} أيام
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
