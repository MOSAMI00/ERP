import { Flag, ShieldAlert, CheckCircle } from 'lucide-react';

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-danger"></div>
        <div className="w-12 h-12 bg-brand-danger/10 text-brand-danger rounded-xl flex items-center justify-center">
          <Flag size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm font-bold mb-1">بلاغات جديدة</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">12</p>
        </div>
      </div>
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-warning"></div>
        <div className="w-12 h-12 bg-brand-warning/10 text-brand-warning rounded-xl flex items-center justify-center">
          <ShieldAlert size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm font-bold mb-1">نشاط مشبوه</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">3</p>
        </div>
      </div>
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex items-center space-x-4 space-x-reverse relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-success"></div>
        <div className="w-12 h-12 bg-brand-success/10 text-brand-success rounded-xl flex items-center justify-center">
          <CheckCircle size={24} />
        </div>
        <div>
          <p className="text-brand-text-muted text-sm font-bold mb-1">تمت المعالجة</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">89</p>
        </div>
      </div>
    </div>
  );
}
