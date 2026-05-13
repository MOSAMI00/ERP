import { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';

export function KYCUploaders() {
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);

  const steps = [
    { label: 'رفع الهوية (الأمامي)', uploaded: frontUploaded, setter: setFrontUploaded, icon: '🪪' },
    { label: 'رفع الهوية (الخلفي)', uploaded: backUploaded, setter: setBackUploaded, icon: '🪪' },
    { label: 'صورة سيلفي', uploaded: selfieUploaded, setter: setSelfieUploaded, icon: '🤳' },
  ];

  const allDone = frontUploaded && backUploaded && selfieUploaded;

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 rounded-xl border border-[#F39C12]/30 bg-[#FEF9E7] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FEF9E7] border border-[#F39C12] flex items-center justify-center text-xl flex-shrink-0">⏳</div>
        <div>
          <p className="font-bold text-[#F39C12] text-sm">التحقق من الهوية قيد الانتظار</p>
          <p className="text-xs text-[#888888] mt-0.5">يرجى رفع المستندات المطلوبة لتفعيل حسابك بالكامل</p>
        </div>
      </div>

      <div className="p-4 bg-white border border-[#E0E0E0] rounded-xl">
        <h3 className="font-bold text-[#222222] mb-1">لماذا نحتاج التحقق؟</h3>
        <p className="text-sm text-[#888888]">للحفاظ على أمان المنصة وضمان حقوق جميع المستخدمين، نحتاج التحقق من هويتك.</p>
      </div>

      <h3 className="font-bold text-[#222222]">المستندات المطلوبة</h3>

      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-[#E0E0E0] rounded-xl">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${step.uploaded ? 'bg-[#EAFAF1]' : 'bg-[#F4F6F9]'}`}>
            {step.uploaded ? '✅' : step.icon}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-[#222222] text-sm">{step.label}</p>
            <p className="text-xs text-[#888888]">{step.uploaded ? 'تم الرفع' : 'لم يتم الرفع بعد'}</p>
          </div>
          <button
            onClick={() => step.setter(true)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              step.uploaded
                ? 'bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/30'
                : 'bg-[#2D5A27] text-white hover:bg-[#3D7A35]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            {step.uploaded ? 'تم' : 'رفع'}
          </button>
        </div>
      ))}

      {allDone && (
        <div className="p-4 bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-xl flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-[#27AE60]" />
          <p className="text-sm text-[#2D5A27] font-medium">تم رفع جميع المستندات! سيتم مراجعتها خلال 24 ساعة.</p>
        </div>
      )}

      <button
        disabled={!allDone}
        className="h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        تقديم طلب التحقق
      </button>
    </div>
  );
}
