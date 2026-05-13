import { Phone } from 'lucide-react';



export function OrderInfoCard({ rental, statusLabel, statusColor, statusBg }) {
  const equipment = getEquipmentSnapshot(rental.equipmentId);

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-[#888888]">رقم الطلب</p>
          <h2 className="text-xl font-bold text-[#222222]">#{rental.orderNum}</h2>
        </div>
        <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: statusColor, backgroundColor: statusBg }}>
          {statusLabel}
        </span>
      </div>
      <div className="flex items-center gap-4 p-4 bg-[#F4F6F9] rounded-xl">
        <div className="w-20 h-20 rounded-xl bg-white border border-[#E0E0E0] overflow-hidden flex-shrink-0">
          <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-[#222222] text-lg">{equipment.name}</h3>
          <p className="text-sm text-[#888888] mt-0.5">{equipment.category}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-[#888888]">👤 {equipment.ownerName}</span>
            <span className="text-[#E0E0E0]">|</span>
            <button className="flex items-center gap-1 text-sm text-[#2D5A27] hover:underline">
              <Phone className="w-3.5 h-3.5" /> <span>{equipment.ownerPhone}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
