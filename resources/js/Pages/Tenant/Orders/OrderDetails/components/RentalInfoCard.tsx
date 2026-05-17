import { MapPin } from 'lucide-react';
import { formatRentalDate } from '../../../../../utils/formatters';


export function RentalInfoCard({ rental }) {
  const equipment = rental.equipment ?? {};
  const location = rental.delivery_location ?? rental.deliveryLocation ?? equipment.address ?? equipment.governorate ?? '—';

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">معلومات الإيجار</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">📅 تاريخ الاستلام</p>
          <p className="font-semibold text-[#222222]">{formatRentalDate(rental.start_date ?? rental.startDate)}</p>
        </div>
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">📅 تاريخ الإرجاع</p>
          <p className="font-semibold text-[#222222]">{formatRentalDate(rental.end_date ?? rental.endDate)}</p>
        </div>
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1"><MapPin className="w-3 h-3 inline" /> الموقع</p>
          <p className="font-semibold text-[#222222]">{location}</p>
        </div>
      </div>
    </div>
  );
}
