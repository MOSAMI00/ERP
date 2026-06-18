import { Lock, FileCheck } from 'lucide-react';

export function TrustBadges() {
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      <div className="flex items-start gap-2">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>مدفوعاتك محمية بنظام Escrow</span>
      </div>
      <div className="flex items-start gap-2">
        <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>العقد يُوقَّع إلكترونياً قبل الاستلام</span>
      </div>
    </div>
  );
}
