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
              <Button size="sm" variant="secondary" className="text-[10px] h-7 px-2">الملف <ChevronLeft size={12} /></Button>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-brand-border border-dashed">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">المؤجر</p>
                <p className="font-bold text-sm text-brand-text-primary">{rental.owner}</p>
              </div>
              <Button size="sm" variant="secondary" className="text-[10px] h-7 px-2">الملف <ChevronLeft size={12} /></Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] text-brand-text-muted uppercase font-bold tracking-wider">المعدة</p>
                <p className="font-bold text-sm text-brand-text-primary">{rental.eq}</p>
              </div>
              <Button size="sm" variant="secondary" className="text-[10px] h-7 px-2">المعدة <ChevronLeft size={12} /></Button>
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

          <div className="space-y-2">
            <Button variant="secondary" className="w-full flex items-center justify-between p-3 h-auto group text-xs font-bold">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-info/10 text-brand-info flex items-center justify-center">
                  <FileText size={16} />
                </div>
                <span>العقد الإلكتروني</span>
              </div>
              <ChevronLeft size={16} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" className="flex flex-col items-center justify-center p-3 h-auto border-dashed">
                <ImageIcon size={20} className="text-brand-text-muted mb-1" />
                <span className="text-[10px] font-bold">صور التسليم</span>
              </Button>
              <Button variant="secondary" className="flex flex-col items-center justify-center p-3 h-auto border-dashed">
                <ImageIcon size={20} className="text-brand-text-muted mb-1" />
                <span className="text-[10px] font-bold">صور الإرجاع</span>
              </Button>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-sm mb-4 text-brand-text-primary flex items-center gap-2">
              <div className="w-1 h-4 bg-brand-primary rounded-full" />
              تتبع الحالة
            </h4>
            <div className="space-y-4 relative pr-4 before:absolute before:right-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-brand-border">
              {['إنشاء الطلب', 'تأكيد المؤجر'].map((label, index) => (
                <div key={label} className="relative flex items-center gap-4">
                  <div className="relative z-10 w-4 h-4 bg-brand-success rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <CheckCircle size={8} className="text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-text-primary text-xs">{label}</h5>
                    <p className="text-[10px] text-brand-text-muted mt-0.5">12 مايو, {index === 0 ? '10:00 ص' : '14:30 م'}</p>
                  </div>
                </div>
              ))}
              <div className="relative flex items-center gap-4">
                <div className="relative z-10 w-4 h-4 bg-brand-warning rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h5 className="font-bold text-brand-warning text-xs">جارٍ الاستخدام</h5>
                  <p className="text-[10px] text-brand-text-muted mt-0.5">15 مايو, 08:00 ص</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
