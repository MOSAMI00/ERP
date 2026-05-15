import { DollarSign, Shield, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function SummaryCards({ summary = {} }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse">
        <div className="w-12 h-12 bg-brand-success/10 text-brand-success rounded-xl flex items-center justify-center">
          <ArrowUpRight size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">إجمالي المدفوعات</p>
          <p className="text-2xl font-bold text-brand-text-primary">{Number(summary.total_completed ?? 0).toLocaleString()} <span className="text-sm font-normal text-brand-text-muted">ر.ي</span></p>
        </div>
      </div>
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse">
        <div className="w-12 h-12 bg-brand-warning/10 text-brand-warning rounded-xl flex items-center justify-center">
          <Shield size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">Escrow المحتجز</p>
          <p className="text-2xl font-bold text-brand-text-primary">{Number(summary.total_pending ?? 0).toLocaleString()} <span className="text-sm font-normal text-brand-text-muted">ر.ي</span></p>
        </div>
      </div>
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse">
        <div className="w-12 h-12 bg-brand-info/10 text-brand-info rounded-xl flex items-center justify-center">
          <ArrowDownRight size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">استردادات التأمين</p>
          <p className="text-2xl font-bold text-brand-text-primary">{Number(summary.total_refunds ?? 0).toLocaleString()} <span className="text-sm font-normal text-brand-text-muted">ر.ي</span></p>
        </div>
      </div>
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse">
        <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">الأرباح المحوّلة</p>
          <p className="text-2xl font-bold text-brand-text-primary">{Number(summary.total_completed ?? 0).toLocaleString()} <span className="text-sm font-normal text-brand-text-muted">ر.ي</span></p>
        </div>
      </div>
    </div>
  );
}
