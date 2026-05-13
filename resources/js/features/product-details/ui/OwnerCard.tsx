import { Star } from 'lucide-react';


export function OwnerCard({ ownerName = 'أحمد علي' }) {
  return (
    <div className="bg-muted rounded-xl p-6 mt-4">
      <h3 className="font-bold mb-4">عن المؤجر</h3>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
          👤
        </div>
        <div>
          <h4 className="font-semibold">{ownerName}</h4>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#F39C12] text-[#F39C12]" />
            <span>4.9 (127 تقييم)</span>
          </div>
        </div>
      </div>
      <div className="text-sm space-y-1 text-muted-foreground">
        <p>📍 صنعاء، اليمن</p>
        <p>🏷️ 12 معدة متاحة</p>
        <p>✅ موثق منذ 2023</p>
      </div>
      <button className="w-full mt-4 h-10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
        عرض جميع المعدات
      </button>
    </div>
  );
}
