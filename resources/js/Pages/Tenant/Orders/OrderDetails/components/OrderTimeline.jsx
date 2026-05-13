import { Clock } from 'lucide-react';


export function OrderTimeline({ steps }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-5">مراحل الطلب</h3>
      <div className="flex items-center gap-0">
        {steps.map((step, idx) => (
          <div key={step.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step.done
                  ? step.active
                    ? 'bg-[#E67E22] text-white ring-4 ring-[#E67E22]/20'
                    : 'bg-[#27AE60] text-white'
                  : 'bg-[#F4F6F9] border-2 border-[#E0E0E0] text-[#888888]'
              }`}>
                {step.done ? (step.active ? '🔧' : '✓') : '○'}
              </div>
              <p className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${step.done ? (step.active ? 'text-[#E67E22]' : 'text-[#27AE60]') : 'text-[#888888]'}`}>
                {step.label}
              </p>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 ${step.done && !step.active ? 'bg-[#27AE60]' : 'bg-[#E0E0E0]'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
