export function FeaturesList() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
          ✓
        </div>
        <div>
          <h3 className="font-semibold mb-1">موثوق من آلاف المستخدمين في اليمن</h3>
          <p className="text-white/80 text-sm">أكثر من 3,500 مستخدم نشط في جميع المحافظات</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
          📄
        </div>
        <div>
          <h3 className="font-semibold mb-1">عقود رقمية موثقة</h3>
          <p className="text-white/80 text-sm">جميع عمليات التأجير محمية بعقود إلكترونية ملزمة</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
          🔒
        </div>
        <div>
          <h3 className="font-semibold mb-1">نظام Escrow لحماية أموالك</h3>
          <p className="text-white/80 text-sm">التأمين محتجز بأمان ويُعاد بعد الإرجاع</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
          📍
        </div>
        <div>
          <h3 className="font-semibold mb-1">متاح في صنعاء، عدن، تعز وأكثر</h3>
          <p className="text-white/80 text-sm">تغطية شاملة لجميع المحافظات اليمنية</p>
        </div>
      </div>
    </div>
  );
}
