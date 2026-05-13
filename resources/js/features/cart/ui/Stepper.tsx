import { Check } from 'lucide-react';


const STEPS = [
  { step: 1, label: 'مراجعة الطلب' },
  { step: 2, label: 'بيانات التسليم' },
  { step: 3, label: 'الدفع والتأكيد' },
];

export function Stepper({ currentStep }) {
  return (
    <div className="bg-muted border-b border-border">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((item, index) => (
              <div key={item.step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      currentStep > item.step || currentStep === item.step
                        ? 'bg-primary text-white'
                        : 'bg-white text-muted-foreground border-2 border-border'
                    }`}
                  >
                    {currentStep > item.step ? <Check className="w-5 h-5" /> : item.step}
                  </div>
                  <span
                    className={`text-sm mt-2 max-sm:text-xs ${
                      currentStep >= item.step ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`h-1 flex-1 mx-2 rounded-full transition-colors ${
                      currentStep > item.step ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
