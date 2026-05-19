import { PlatformTermsDisplay } from '@/Components/PlatformTermsDisplay';

interface TabTermsProps {
  terms?: string | null;
}

export function TabTerms({ terms }: TabTermsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-bold text-foreground">الشروط والاستخدام</h3>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          قبل إرسال طلب التأجير، راجع شروط المنصة لأنها توضح مسؤوليات المؤجر والمستأجر وآلية الدفع والتأمين والتسليم والنزاعات.
        </p>
      </div>
      <PlatformTermsDisplay terms={terms} />
    </div>
  );
}
