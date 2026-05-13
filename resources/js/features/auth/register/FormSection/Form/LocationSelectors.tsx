import { MapPin } from 'lucide-react';

const governorates = [
  'صنعاء',
  'عدن',
  'تعز',
  'الحديدة',
  'إب',
  'مأرب',
  'حضرموت',
  'المكلا',
  'ذمار',
  'لحج',
  'أبين',
  'شبوة',
  'البيضاء',
  'الجوف',
  'عمران',
  'ريمة',
  'المهرة',
  'المحويت',
  'الضالع',
  'سقطرى',
];


export function LocationSelectors({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">المحافظة</label>
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <select
            value={formData.governorate}
            onChange={(e) =>
              setFormData({ ...formData, governorate: e.target.value })
            }
            className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
            required
          >
            <option value="">اختر المحافظة</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">المديرية / الحي</label>
        <input
          type="text"
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          placeholder="مثال: المدينة، كريتر، الوحدة..."
          className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
        />
      </div>
    </>
  );
}
