import { visit } from '../../../../../inertia/navigation';
import { AlertCircle } from 'lucide-react';




export function OrderActionBanner({ rentals }) {
  
  const paymentDue = rentals.find((rental) => rental.status === 'confirmed' && rental.paymentStatus === 'unpaid');
  const readyForDelivery = rentals.find((rental) => rental.status === 'confirmed' && rental.paymentStatus === 'paid' && isRentalStartingSoon(rental));
  const pending = rentals.find((rental) => rental.status === 'pending');
  const primary = paymentDue ?? readyForDelivery ?? pending;

  if (!primary) return null;

  const equipment = getEquipmentSnapshot(primary.equipmentId);
  const isPaymentDue = primary.status === 'confirmed' && primary.paymentStatus === 'unpaid';
  const isPending = primary.status === 'pending';

  return (
    <div className="bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-2xl p-4 mb-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#2D5A27] text-sm">
            {isPaymentDue ? 'لديك طلب مقبول ينتظر الدفع' : isPending ? 'طلبك بانتظار موافقة المؤجر' : 'طلبك قريب من موعد الاستلام'}
          </p>
          <p className="text-xs text-[#3D7A35] mt-0.5">
            #{primary.orderNum} · {equipment.name}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button
          onClick={() => visit(isPaymentDue || isPending ? `/dashboard/order/${primary.id}` : `/dashboard/order/${primary.id}/delivery`)}
          className="px-4 py-2 bg-[#2D5A27] text-white text-sm font-semibold rounded-xl hover:bg-[#3D7A35] transition-colors"
        >
          {isPaymentDue ? 'أكمل الدفع' : isPending ? 'عرض الطلب' : 'جاهز للاستلام؟'}
        </button>
      </div>
    </div>
  );
}
