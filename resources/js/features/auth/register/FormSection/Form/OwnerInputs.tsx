import { Info } from 'lucide-react';

const governorates = [
  'صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'مأرب', 'حضرموت', 'المكلا',
  'ذمار', 'لحج', 'أبين', 'شبوة', 'البيضاء', 'الجوف', 'عمران', 'ريمة',
  'المهرة', 'المحويت', 'الضالع', 'سقطرى',
];

const equipmentCategories = [
  'مولدات', 'بناء', 'زراعة', 'تصوير', 'فعاليات', 'طبي', 'رياضة', 'أخرى',
];

const paymentMethods = [
  'تحويل بنكي', 'كاش (يدوي)', 'محفظة إلكترونية',
];


export function OwnerInputs({ formData, setFormData, selectedCategories, toggleCategory }) {
  return (
    <>
      <div className="border-t border-[#E0E0E0] pt-4 mt-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-xl">🔑</span>
          معلومات المؤجر
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              اسم المتجر / المؤجر
            </label>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) =>
                setFormData({ ...formData, storeName: e.target.value })
              }
              placeholder="مثال: معدات البناء الحديث"
              className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              نوع المعدات
            </label>
            <div className="flex flex-wrap gap-2">
              {equipmentCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategories.includes(category)
                      ? 'bg-[#2D5A27] text-white'
                      : 'bg-[#F8F8F8] text-[#222222] hover:bg-[#E0E0E0]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              المحافظة الرئيسية للنشاط
            </label>
            <select
              value={formData.mainGovernorate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mainGovernorate: e.target.value,
                })
              }
              className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
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

          <div>
            <label className="block text-sm font-medium mb-2">
              وسيلة استلام الأرباح
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) =>
                setFormData({ ...formData, paymentMethod: e.target.value })
              }
              className="w-full px-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none appearance-none cursor-pointer"
              required
            >
              <option value="">اختر وسيلة الدفع</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#FFF9E6] border border-[#F39C12] rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-[#F39C12] flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="text-[#222222] mb-1">
            سيُطلب منك رفع صورة بطاقة شخصية أو جواز سفر قبل إتمام أول حجز
          </p>
          <button
            type="button"
            className="text-[#F39C12] hover:underline font-medium"
          >
            اعرف المزيد ←
          </button>
        </div>
      </div>
    </>
  );
}
