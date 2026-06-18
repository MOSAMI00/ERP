import { Edit, Trash2, ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { formatRentalDateRange } from '../../../utils/formatters';



export function ReviewItems({ cartItems, onDelete, onNext }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">مراجعة الطلب</h2>

      {cartItems.length === 0 ? (
        <div className="bg-white border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">سلة المشتريات فارغة</h3>
          <p className="text-muted-foreground mb-6">لم تقم بإضافة أي معدات إلى السلة بعد.</p>
          <Link
            href="/"
            className="inline-flex h-12 px-6 bg-primary text-white rounded-lg font-semibold items-center justify-center hover:bg-primary/90 transition-colors"
          >
            تصفح المعدات
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white border border-border rounded-xl p-6 mb-4">
              <div className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2"><span>📍</span><span>{item.location}</span></p>
                    <p className="flex items-center gap-2"><span>👤</span><span>{item.owner}</span></p>
                    <p className="flex items-center gap-2"><span>📅</span><span>{formatRentalDateRange(item.startDate, item.endDate)}</span></p>
                    <p className="flex items-center gap-2"><span>⏱️</span><span>{item.days} أيام</span></p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Edit className="w-5 h-5 text-primary" />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="p-2 hover:bg-muted rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={onNext}
            className="w-full h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            متابعة للخطوة التالية ←
          </button>
        </>
      )}
    </div>
  );
}
