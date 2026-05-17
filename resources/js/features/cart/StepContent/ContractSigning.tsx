import { ShieldCheck, Signature } from 'lucide-react';

export function ContractSigning({ 
  agreeToContract, 
  setAgreeToContract, 
  onBack, 
  onConfirm, 
  processing, 
  errors,
  contractBody,
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

      <div className="bg-muted/50 border border-border rounded-xl p-6 h-[400px] overflow-y-auto text-sm leading-relaxed text-foreground/80 font-arabic">
        <pre className="whitespace-pre-wrap font-inherit m-0" style={{ fontFamily: 'inherit' }}>
          {contractBody ?? 'تعذر تحميل نص العقد. يرجى العودة للخطوة السابقة والمحاولة مرة أخرى.'}
        </pre>
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

      {errors && Object.keys(errors).length > 0 && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
          <p className="text-danger font-bold mb-2">توجد أخطاء في الطلب:</p>
          <ul className="list-disc list-inside text-sm text-danger/80">
            {Object.entries(errors).map(([field, msg]) => (
              <li key={field}>{String(msg)}</li>
            ))}
          </ul>
        </div>
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
