import { ShieldCheck, Signature } from 'lucide-react';

export function ContractSigning({ 
  agreeToContract, 
  setAgreeToContract, 
  onBack, 
  onConfirm, 
  processing, 
  errors 
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Signature size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">العقد الإلكتروني</h2>
          <p className="text-muted-foreground text-sm">يرجى مراجعة وتوقيع العقد للمتابعة</p>
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-xl p-6 h-[400px] overflow-y-auto space-y-4 text-sm leading-relaxed text-foreground/80 font-arabic">
        <h3 className="font-bold text-center text-lg mb-4 underline">عقد تأجير معدات إلكتروني</h3>
        
        <section>
          <h4 className="font-bold text-foreground">1. أطراف العقد:</h4>
          <p>يعتبر هذا العقد اتفاقاً ملزماً بين مالك المعدة (المؤجر) والمستأجر المسجل في منصة إيجار.</p>
        </section>

        <section>
          <h4 className="font-bold text-foreground">2. مسؤولية المعدة:</h4>
          <p>يقر المستأجر باستلام المعدة بحالة جيدة وصالحة للاستخدام، ويتعهد بالحفاظ عليها وإعادتها بنفس الحالة التي استلمها بها.</p>
        </section>

        <section>
          <h4 className="font-bold text-foreground">3. التأمين والتعويض:</h4>
          <p>يتم حجز مبلغ التأمين كضمان، وفي حال حدوث أضرار ناتجة عن سوء الاستخدام، يحق للمؤجر طلب تعويض يخصم من مبلغ التأمين أو يطالب به قانوناً.</p>
        </section>

        <section>
          <h4 className="font-bold text-foreground">4. التأخير في الإرجاع:</h4>
          <p>تطبق رسوم إضافية في حال التأخر عن الموعد المحدد للإرجاع، بواقع 150% من القيمة اليومية لكل يوم تأخير.</p>
        </section>

        <section>
          <h4 className="font-bold text-foreground">5. حل النزاعات:</h4>
          <p>في حال وجود خلاف، يتم اللجوء لنظام النزاعات في منصة إيجار كطرف أول للفصل بين الطرفين بناءً على تقارير التسليم والاستلام.</p>
        </section>

        <div className="border-t border-border pt-4 mt-8 italic text-center text-muted-foreground">
          تم إنشاء هذا العقد آلياً بواسطة منصة إيجار
        </div>
      </div>

      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3 items-start">
        <div className="mt-1 flex-shrink-0">
          <input 
            type="checkbox" 
            id="agree_contract"
            checked={agreeToContract}
            onChange={(e) => setAgreeToContract(e.target.checked)}
            className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
        </div>
        <label htmlFor="agree_contract" className="text-sm cursor-pointer select-none">
          <span className="font-bold block mb-1">أوافق على جميع شروط العقد المذكورة أعلاه</span>
          <span className="text-muted-foreground">بالتأشير هنا، أنت تقر بأن هذا التوقيع الإلكتروني ملزم قانوناً.</span>
        </label>
      </div>

      {errors?.agree_to_contract && (
        <p className="text-red-500 text-sm font-medium">{errors.agree_to_contract}</p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 h-12 border border-border rounded-lg hover:bg-muted transition-colors">
          → رجوع
        </button>
        <button 
          onClick={onConfirm} 
          disabled={!agreeToContract || processing}
          className="flex-1 h-12 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? 'جاري المعالجة...' : 'توقيع وإرسال الطلب ←'}
        </button>
      </div>
    </div>
  );
}
