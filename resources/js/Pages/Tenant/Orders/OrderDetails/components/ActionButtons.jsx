import { visit } from '../../../../../inertia/navigation';
import { router } from '@inertiajs/react';
import { Clock, FileText, ReceiptText, XCircle } from 'lucide-react';

const enumValue = (value) => (typeof value === 'object' ? value?.value : value);
const paidRentalPayment = (rental) => rental.payments?.find?.((payment) => (
  enumValue(payment.type) === 'rental' && enumValue(payment.status) === 'paid'
));


export function ActionButtons({ rental }) {
  const isPaid = ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status)
    || rental.payments?.some?.((payment) => enumValue(payment.status) === 'paid');
  const canCancelBeforePayment = ['pending', 'confirmed'].includes(rental.status) && !isPaid;
  const receiptPayment = paidRentalPayment(rental);

  const cancelRental = () => {
    if (!confirm('هل أنت متأكد من إلغاء العملية؟')) return;
    router.post(`/rentals/${rental.id}/cancel`, {
      cancellation_reason: 'ألغى المستأجر العملية قبل الدفع',
    }, { preserveScroll: true });
  };
  
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">الإجراءات</h3>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => visit('/dashboard/contracts')} className="flex items-center gap-2 px-5 py-2.5 border border-[#2D5A27] text-[#2D5A27] rounded-xl text-sm font-semibold hover:bg-[#EAF3E9]">
          <FileText className="w-4 h-4" /> عرض العقد
        </button>
        <button onClick={() => visit(`/dashboard/order/${rental.id}/delivery`)} className="flex items-center gap-2 px-5 py-2.5 border border-[#3498DB] text-[#3498DB] rounded-xl text-sm font-semibold hover:bg-[#EBF5FB]">
          <Clock className="w-4 h-4" /> التسليم والإرجاع
        </button>
        {receiptPayment ? (
          <button onClick={() => visit(`/payments/${receiptPayment.id}`)} className="flex items-center gap-2 px-5 py-2.5 border border-[#2D5A27] text-[#2D5A27] rounded-xl text-sm font-semibold hover:bg-[#EAF3E9]">
            <ReceiptText className="w-4 h-4" /> عرض إيصال الدفع
          </button>
        ) : null}
        {canCancelBeforePayment ? (
          <button onClick={cancelRental} className="flex items-center gap-2 px-5 py-2.5 border border-[#E74C3C] text-[#E74C3C] rounded-xl text-sm font-semibold hover:bg-[#FDEDEC]">
            <XCircle className="w-4 h-4" /> إلغاء العملية
          </button>
        ) : null}
      </div>
    </div>
  );
}
