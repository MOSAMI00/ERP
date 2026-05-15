import { ShoppingCart, DollarSign, AlertTriangle, Users, TrendingUp } from 'lucide-react';

export default function KpiRow1() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-lg flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <span className="flex items-center text-brand-success text-sm font-bold">
            <TrendingUp size={16} className="mr-1" /> +12%
          </span>
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">عمليات التأجير</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">1,240</p>
        </div>
      </div>

      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-brand-success/10 text-brand-success rounded-lg flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <span className="flex items-center text-brand-success text-sm font-bold">
            <TrendingUp size={16} className="mr-1" /> +8%
          </span>
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">الأرباح</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">4.2M <span className="text-base font-normal text-brand-text-muted">ر.ي</span></p>
        </div>
      </div>

      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-brand-danger/10 text-brand-danger rounded-lg flex items-center justify-center">
            <AlertTriangle size={24} />
          </div>
          <span className="flex items-center text-brand-danger text-sm font-bold px-2 py-1 bg-brand-danger/10 rounded-full">
            🔴 مراجعة
          </span>
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">النزاعات</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">18</p>
        </div>
      </div>

      <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 bg-brand-info/10 text-brand-info rounded-lg flex items-center justify-center">
            <Users size={24} />
          </div>
          <span className="flex items-center text-brand-success text-sm font-bold">
            <TrendingUp size={16} className="mr-1" /> +24 اليوم
          </span>
        </div>
        <div>
          <p className="text-brand-text-muted text-sm mb-1">المستخدمون</p>
          <p className="text-[32px] font-bold text-brand-text-primary leading-none">3,580</p>
        </div>
      </div>
    </div>
  );
}
