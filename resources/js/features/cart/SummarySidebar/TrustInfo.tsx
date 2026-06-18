import { FileCheck, Lock, RefreshCw } from 'lucide-react';

export function TrustInfo() {
  return (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="bg-[#E8F5E9] rounded-lg p-3 flex items-start gap-3">
        <Lock className="w-5 h-5 text-[#27AE60] flex-shrink-0" />
        <div className="text-xs text-foreground">
          <p className="font-semibold mb-1">التأمين يحتجز في Escrow</p>
          <p className="text-muted-foreground">ويعاد بعد اكتمال التأجير</p>
        </div>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <FileCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>عقد موثق إلكترونيا</span>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <RefreshCw className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>استرداد التأمين خلال 5 أيام عمل</span>
      </div>
      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>دفع آمن 100%</span>
      </div>
    </div>
  );
}
