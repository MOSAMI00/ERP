import { OrderCard } from './OrderCard';

export function OrdersGrid({ filtered }) {
  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-[#F4F6F9] rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">📋</span>
        </div>
        <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد طلبات</h3>
        <p className="text-[#888888] text-sm max-w-xs">لم تقم بأي طلبات إيجار بعد. ابدأ بتصفح المعدات المتاحة.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-4 px-6 py-2.5 bg-[#2D5A27] text-white rounded-xl text-sm font-semibold hover:bg-[#3D7A35] transition-colors"
        >
          تصفح المعدات
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {filtered.map(rental => (
        <OrderCard key={rental.id} rental={rental} />
      ))}
    </div>
  );
}
