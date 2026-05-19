import { X, ChevronLeft, Calendar, Shield, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';

export default function RentalDrawer({ isOpen, rental, onClose }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      bodyClassName="flex-1 overflow-y-auto p-5 space-y-5"
      header={rental && (
        <div className="flex items-center justify-between p-4 border-b border-brand-border bg-brand-card/80 backdrop-blur-md">
          <div>
            <h2 className="text-lg font-bold text-brand-text-primary flex items-center">
              تفاصيل العملية
              <span className="text-xs font-normal text-brand-text-muted ml-2 mr-2" dir="ltr">#{rental.id}</span>
            </h2>
            <div className="mt-1">
              <Badge variant={rental.statusColor === 'pending' ? 'neutral' : rental.statusColor}>
                {rental.statusLabel ?? rental.status}
              </Badge>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-brand-text-muted hover:text-brand-danger rounded-lg hover:bg-brand-danger/5 transition-colors">
            <X size={20} />
          </button>
        </div>
      )}
    >
      {rental && (
        <>
          <div className="bg-brand-content/50 rounded-xl p-3 border border-brand-border space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-brand-border border-dashed">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">المستأجر</p>
                <p className="font-bold text-sm text-brand-text-primary">{rental.tenant}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-brand-border border-dashed">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">المؤجر</p>
                <p className="font-bold text-sm text-brand-text-primary">{rental.owner}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">المعدة</p>
                <p className="font-bold text-sm text-brand-text-primary">{rental.eq}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-xl border border-brand-border shadow-sm">
              <p className="text-[10px] text-brand-text-muted uppercase font-bold mb-1 flex items-center"><Calendar size={12} className="ml-1" /> الفترة</p>
              <p className="font-bold text-xs" dir="ltr">{rental.startDate}</p>
              <p className="font-bold text-xs" dir="ltr">{rental.endDate}</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-brand-border shadow-sm text-center">
              <p className="text-[10px] text-brand-text-muted uppercase font-bold mb-1">المدة</p>
              <p className="font-black text-brand-text-primary text-base">{rental.duration}</p>
            </div>
          </div>

          <div className="bg-brand-primary/5 p-4 rounded-xl border border-brand-primary/10 space-y-3">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold mb-1">الإيجار الإجمالي</p>
                <p className="font-black text-brand-primary text-xl leading-none">
                  {rental.total.toLocaleString()}
                  <span className="text-xs font-normal text-brand-text-primary mr-1">ر.ي</span>
                </p>
              </div>
              <div className="text-left">
                <p className="text-[10px] text-brand-text-muted uppercase font-bold mb-1">التأمين</p>
                <p className="font-bold text-brand-text-primary text-sm">{rental.insurance.toLocaleString()} ر.ي</p>
              </div>
            </div>
            <div className="pt-3 border-t border-brand-primary/10 flex justify-between items-center">
              <p className="text-xs font-bold text-brand-warning flex items-center"><Shield size={14} className="ml-2" /> محتجز في Escrow</p>
              <p className="font-black text-brand-warning text-sm">{rental.escrow.toLocaleString()} ر.ي</p>
            </div>
          </div>

        </>
      )}
    </Drawer>
  );
}
