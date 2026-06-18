export function ReviewsSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">مؤجرون موثوقون</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'أحمد محمد', rating: 4.9, equipmentCount: 12, location: 'صنعاء' },
            { name: 'سعيد علي', rating: 4.8, equipmentCount: 8, location: 'عدن' },
            { name: 'خالد حسين', rating: 5.0, equipmentCount: 15, location: 'تعز' },
            { name: 'محمد صالح', rating: 4.7, equipmentCount: 6, location: 'إب' },
          ].map((owner, index) => (
            <div key={index} className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
                👤
              </div>
              <h3 className="font-bold text-center mb-2">{owner.name}</h3>
              <div className="text-center space-y-1 text-sm text-muted-foreground mb-4">
                <p>⭐ {owner.rating} / 5.0</p>
                <p>{owner.equipmentCount} معدة</p>
                <p>📍 {owner.location}</p>
              </div>
              <button className="w-full h-10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                عرض المعدات
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
