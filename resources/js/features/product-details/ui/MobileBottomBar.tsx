import { visit } from '../../../inertia/navigation';



export function MobileBottomBar({ dailyRate }) {
  

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 shadow-lg z-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-lg font-bold text-primary">
            {dailyRate.toLocaleString('ar-YE')} ر.ي
          </div>
          <div className="text-xs text-muted-foreground">اليوم</div>
        </div>
        <button
          onClick={() => visit('/cart')}
          className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold"
        >
          استأجره الآن →
        </button>
      </div>
    </div>
  );
}
