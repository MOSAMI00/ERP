
export function DatePickers({ startDate, setStartDate, endDate, setEndDate, days, notes, setNotes }) {
  return (
    <div className="border-t border-border pt-4 space-y-3">
      <div className="space-y-2">
        <label className="block text-sm font-medium">📅 تاريخ الاستلام</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">📅 تاريخ الإرجاع</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary"
        />
      </div>

      {days > 0 && (
        <div className="bg-muted rounded-lg p-3 text-sm">
          ⏱️ المدة: <span className="font-semibold">{days} {days === 1 ? 'يوم' : 'أيام'}</span>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">📍 المحافظة</label>
        <select className="w-full h-11 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary">
          <option>صنعاء</option>
          <option>عدن</option>
          <option>تعز</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">ملاحظات (اختياري)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="أي تفاصيل إضافية..."
          className="w-full h-20 px-4 py-2 rounded-lg border border-border bg-white focus:outline-none focus:border-primary resize-none"
        />
      </div>
    </div>
  );
}
