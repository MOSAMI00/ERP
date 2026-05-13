
export function EscrowStatus({ rental }) {
  const isPaid = rental.paymentStatus === 'paid';
  const isReleased = rental.escrowStatus === 'released';
  const title = isReleased ? 'تم تحرير الضمان' : isPaid ? 'المبلغ محفوظ في الضمان' : 'الدفع لم يكتمل بعد';
  const description = isReleased
    ? 'تم تحرير المبلغ للمؤجر بعد اكتمال الإرجاع'
    : isPaid
      ? 'سيتم تحرير المبلغ للمؤجر بعد تأكيد الإرجاع'
      : 'سيظهر الضمان بعد اكتمال الدفع';
  const progress = isReleased ? 100 : isPaid ? 80 : 20;

  return (
    <div className="bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#27AE60] text-white flex items-center justify-center text-sm">🔒</div>
        <h3 className="font-bold text-[#2D5A27]">حالة الضمان</h3>
      </div>
      <p className="text-sm text-[#3D7A35]">{title}</p>
      <p className="text-xs text-[#888888] mt-2">{description}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
          <div className="h-full bg-[#27AE60] rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-[#27AE60]">{progress}%</span>
      </div>
    </div>
  );
}
