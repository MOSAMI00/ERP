import { FileText, Scale, ShieldCheck } from 'lucide-react';

type PlatformTermsDisplayProps = {
  terms?: string | null;
  compact?: boolean;
};

function splitTerms(terms?: string | null) {
  return (terms ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isHeading(line: string) {
  return /^(\d+[\.\-)]|[٠-٩]+[\.\-)]|المادة\s+)/.test(line);
}

export function PlatformTermsDisplay({ terms, compact = false }: PlatformTermsDisplayProps) {
  const lines = splitTerms(terms);

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        لم يتم ضبط شروط استخدام المنصة بعد.
      </div>
    );
  }

  const [intro, ...rest] = lines;

  return (
    <section className="space-y-5" dir="rtl">
      {!compact && (
        <div className="rounded-lg border border-primary/15 bg-primary/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Scale className="h-5 w-5" />
            <h3 className="text-lg font-bold">شروط الاستخدام وسياسات المنصة</h3>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            هذه الشروط تنظم العلاقة بين المنصة والمؤجر والمستأجر، وتوضح آلية الطلب والدفع والتسليم والاستلام والتعويضات.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex gap-3 rounded-lg border border-border bg-background p-4">
          <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-7 text-foreground">{intro}</p>
        </div>

        <div className="grid gap-3">
          {rest.map((line, index) => (
            <article
              key={`${line}-${index}`}
              className="rounded-lg border border-border bg-background p-4 shadow-sm"
            >
              <div className="flex gap-3">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <p className={`text-sm leading-7 ${isHeading(line) ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
                  {line}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
