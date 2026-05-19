import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { usePage } from '@inertiajs/react';
import { PlatformTermsDisplay } from '@/Components/PlatformTermsDisplay';

export function HelpCenter() {
  const [open, setOpen] = useState(false);
  const { props } = usePage();
  const pageProps = props as any;
  const platformTerms = pageProps.sharedData?.platform_terms ?? pageProps.platform_terms ?? '';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-muted transition-colors group flex items-center justify-center"
        title="شروط استخدام المنصة"
        aria-label="شروط استخدام المنصة"
      >
        <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-[#2D5A27] transition-colors" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4" role="dialog" aria-modal="true">
          <div className="max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-xl" dir="rtl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">شروط استخدام المنصة</h2>
                <p className="mt-1 text-sm text-muted-foreground">مرجع سريع لحقوق ومسؤوليات المؤجر والمستأجر.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              <PlatformTermsDisplay terms={platformTerms} compact />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
