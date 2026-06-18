
const TIME_SLOTS = [
  { value: 'morning', label: '☀️ صباحاً', time: '8ص - 12م' },
  { value: 'afternoon', label: '🌤️ ظهراً', time: '12م - 4م' },
  { value: 'evening', label: '🌙 مساءً', time: '4م - 8م' },
];

export function DeliveryForm({ deliveryInfo, setDeliveryInfo, timeSlot, setTimeSlot, error, onBack, onNext }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">بيانات التسليم</h2>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">المحافظة</label>
            <select
              value={deliveryInfo.governorate}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, governorate: e.target.value })}
              className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
            >
              {['صنعاء', 'عدن', 'تعز', 'إب'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">المديرية / الحي</label>
            <input
              type="text"
              value={deliveryInfo.district}
              onChange={(e) => setDeliveryInfo({ ...deliveryInfo, district: e.target.value })}
              placeholder="مثال: الوحدة"
              className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
            <label className="block text-sm font-medium">العنوان التفصيلي</label>
          <textarea
            value={deliveryInfo.address}
            onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
            placeholder="رقم المنزل، اسم الشارع، علامات مميزة..."
            className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary resize-none"
          />
        </div>


        <div className="space-y-2">
          <label className="block text-sm font-medium">الوقت المفضل للاستلام</label>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot.value}
                type="button"
                onClick={() => setTimeSlot(slot.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  timeSlot === slot.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-semibold text-sm">{slot.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{slot.time}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 h-12 border border-border rounded-lg hover:bg-muted transition-colors">
          → رجوع
        </button>
        <button onClick={onNext} className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          متابعة للعقد ←
        </button>
      </div>
    </div>
  );
}
