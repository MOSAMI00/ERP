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

          {formData.paymentMethod === 'تحويل بنكي' && (
            <div className="space-y-4 p-4 bg-[#F8F8F8] rounded-lg border border-[#E0E0E0]">
              <div>
                <label className="block text-xs font-medium mb-1 text-[#666666]">اسم البنك *</label>
                <input
                  type="text"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                  placeholder="مثال: بنك الكريمي"
                  className="w-full px-4 h-10 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-[#666666]">رقم الحساب *</label>
                  <input
                    type="text"
                    value={formData.account_number}
                    onChange={(e) => setFormData({ ...formData, account_number: e.target.value })}
                    placeholder="123456789"
                    className="w-full px-4 h-10 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none text-sm"
                    style={{ direction: 'ltr' }}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-[#666666]">اسم صاحب الحساب *</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    placeholder="كما هو في البنك"
                    className="w-full px-4 h-10 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'محفظة إلكترونية' && (
            <div className="p-4 bg-[#F8F8F8] rounded-lg border border-[#E0E0E0]">
              <label className="block text-xs font-medium mb-1 text-[#666666]">رقم المحفظة / الهاتف *</label>
              <input
                type="text"
                value={formData.wallet_number}
                onChange={(e) => setFormData({ ...formData, wallet_number: e.target.value })}
                placeholder="77XXXXXXX"
                className="w-full px-4 h-10 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none text-sm"
                style={{ direction: 'ltr' }}
                required
              />
            </div>
          )}
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
