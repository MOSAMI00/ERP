import { CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useState } from 'react';
import { ContractCheckbox } from './ContractCheckbox';


const METHODS = [
  { value: 'bank_transfer', icon: CreditCard, label: 'بطاقة بنكية', desc: 'Visa, Mastercard' },
  { value: 'platform_wallet', icon: Smartphone, label: 'محفظة إلكترونية', desc: 'كاش يمن، سبأفون، فلوسك' },
  { value: 'cash', icon: Wallet, label: 'دفع عند الاستلام', desc: 'كاش' },
];

export function PaymentMethods({
  paymentMethod,
  setPaymentMethod,
  agreeToContract,
  setAgreeToContract,
  onBack,
  onConfirm,
  requestOnly = false,
  payAfterLessorApproval = false,
  hideBack = false,
}) {
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const bookingRequestMode = requestOnly && !payAfterLessorApproval;
  const showPaymentPickers = !bookingRequestMode;

  const cardComplete =
    cardDetails.number.trim().length >= 12 &&
    cardDetails.expiry.trim().length >= 4 &&
    cardDetails.cvv.trim().length >= 3 &&
    cardDetails.name.trim().length > 1;

  const payConfirmDisabled =
    !agreeToContract ||
    (bookingRequestMode
      ? false
      : payAfterLessorApproval
        ? !paymentMethod || (paymentMethod === 'bank_transfer' && !cardComplete)
        : !paymentMethod);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        {payAfterLessorApproval ? 'إتمام الدفع' : bookingRequestMode ? 'تأكيد الطلب' : 'وسيلة الدفع'}
      </h2>

      {payAfterLessorApproval && (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <p className="font-semibold mb-1">وافق المؤجر على طلبك</p>
          <p className="text-sm text-muted-foreground">
            اختر وسيلة الدفع وأكمل البيانات المطلوبة لتأكيد الحجز وحفظ المبلغ في الضمان.
          </p>
        </div>
      )}

      {bookingRequestMode ? (
        <div className="rounded-xl border border-border bg-muted/30 p-5">
          <p className="font-semibold mb-1">سيتم إرسال الطلب للمؤجر أولاً</p>
          <p className="text-sm text-muted-foreground">
            بعد الموافقة سيظهر لك إشعار وزر إتمام الدفع. لن يتم إنشاء عملية دفع في هذه الخطوة.
          </p>
        </div>
      ) : showPaymentPickers ? (
        <div className="space-y-3">
          {METHODS.map(({ value, icon: Icon, label, desc }) => (
            <button
              key={value}
              onClick={() => setPaymentMethod(value)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-right flex items-center gap-4 ${
                paymentMethod === value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === value ? 'border-primary' : 'border-border'}`}>
                {paymentMethod === value && <div className="w-3 h-3 rounded-full bg-primary" />}
              </div>
              <Icon className="w-6 h-6 text-muted-foreground" />
              <div className="flex-1">
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-muted-foreground">{desc}</div>
              </div>
            </button>
          ))}
        </div>
      ) : null}

      {showPaymentPickers && paymentMethod === 'bank_transfer' && (
        <div className="border border-border rounded-xl p-6 space-y-4 bg-muted/30">
          <h3 className="font-bold text-lg">بيانات البطاقة البنكية</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">رقم البطاقة</label>
              <input type="text" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} placeholder="0000 0000 0000 0000" className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary" dir="ltr" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">تاريخ الانتهاء</label>
                <input type="text" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} placeholder="MM/YY" className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary" dir="ltr" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">CVV</label>
                <input type="text" value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} placeholder="123" className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary" dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">الاسم على البطاقة</label>
              <input type="text" value={cardDetails.name} onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })} placeholder="الاسم الكامل" className="w-full h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary" />
            </div>
          </div>
        </div>
      )}

      <ContractCheckbox agreeToContract={agreeToContract} setAgreeToContract={setAgreeToContract} />

      <div className="flex gap-3">
        {!hideBack && (
          <button type="button" onClick={onBack} className="flex-1 h-12 border border-border rounded-lg hover:bg-muted transition-colors">
            → رجوع
          </button>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={payConfirmDisabled}
          className={`h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed ${hideBack ? 'w-full' : 'flex-1'}`}
        >
          {bookingRequestMode ? 'إرسال طلب الحجز للمؤجّر ←' : payAfterLessorApproval ? 'تأكيد الدفع وحجز الضمان ←' : 'تأكيد الحجز ودفع ←'}
        </button>
      </div>
    </div>
  );
}
