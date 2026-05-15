import { X, ChevronLeft, Calendar, Clock, Shield, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Drawer from '../../../components/ui/Drawer';

export default function RentalDrawer({ isOpen, rental, onClose }) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      bodyClassName="flex-1 overflow-y-auto p-6 space-y-6"
      header={rental && (
        <div className="flex items-center justify-between p-6 border-b border-brand-border bg-brand-content/50">
          <div>
            <h2 className="text-xl font-bold text-brand-text-primary flex items-center">
              تفاصيل العملية 
              <span className="text-sm font-normal text-brand-text-muted ml-2 mr-2" dir="ltr">{rental.id}</span>
            </h2>
            <div className="mt-2">
              <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                rental.statusColor === 'pending' ? 'bg-brand-text-muted/10 text-brand-text-muted' :
                `bg-brand-${rental.statusColor}/10 text-brand-${rental.statusColor}`
              }`}>
                {rental.status === 'In Use' ? 'In Use 🔧' : rental.status}
              </Badge>
            </div>
          </div>
          <Button unstyled onClick={onClose} className="p-2 text-brand-text-muted hover:text-brand-danger rounded-full hover:bg-brand-danger/10 transition-colors">
            <X size={24} />
          </Button>
        </div>
      )}
    >
      {rental && (
        <>
          <div className="bg-brand-content rounded-xl p-4 border border-brand-border space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-brand-border border-dashed">
              <div>
                <p className="text-xs text-brand-text-muted mb-1">المستأجر</p>
                <p className="font-bold text-brand-text-primary">{rental.tenant}</p>
              </div>
              <Button unstyled className="text-brand-info text-sm font-bold flex items-center hover:underline">عرض الملف <ChevronLeft size={14} /></Button>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-brand-border border-dashed">
              <div>
                <p className="text-xs text-brand-text-muted mb-1">المؤجر</p>
                <p className="font-bold text-brand-text-primary">{rental.owner}</p>
              </div>
              <Button unstyled className="text-brand-info text-sm font-bold flex items-center hover:underline">عرض الملف <ChevronLeft size={14} /></Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-brand-text-muted mb-1">المعدة</p>
                <p className="font-bold text-brand-text-primary">{rental.eq}</p>
              </div>
              <Button unstyled className="text-brand-info text-sm font-bold flex items-center hover:underline">عرض المعدة <ChevronLeft size={14} /></Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-content p-4 rounded-xl border border-brand-border">
              <p className="text-xs text-brand-text-muted mb-1 flex items-center"><Calendar size={12} className="ml-1"/> فترة الإيجار</p>
              <p className="font-bold text-sm" dir="ltr">{rental.startDate}</p>
              <p className="font-bold text-sm" dir="ltr">{rental.endDate}</p>
            </div>
            <div className="bg-brand-content p-4 rounded-xl border border-brand-border">
              <p className="text-xs text-brand-text-muted mb-1 flex items-center"><Clock size={12} className="ml-1"/> المدة</p>
              <p className="font-bold text-brand-text-primary text-lg">{rental.duration}</p>
            </div>
            <div className="bg-brand-content p-4 rounded-xl border border-brand-border col-span-2 flex justify-between items-center">
              <div>
                <p className="text-xs text-brand-text-muted mb-1">مبلغ الإيجار الإجمالي</p>
                <p className="font-bold text-brand-primary text-xl">{rental.total.toLocaleString()} <span className="text-sm font-normal text-brand-text-primary">ر.ي</span></p>
              </div>
              <div className="text-left">
                <p className="text-xs text-brand-text-muted mb-1">مبلغ التأمين</p>
                <p className="font-bold text-brand-text-primary">{rental.insurance.toLocaleString()} ر.ي</p>
              </div>
            </div>
            <div className="bg-brand-warning/10 p-4 rounded-xl border border-brand-warning/20 col-span-2 flex justify-between items-center">
              <p className="text-sm font-bold text-brand-warning flex items-center"><Shield size={16} className="ml-2"/> Escrow المحتجز حالياً</p>
              <p className="font-bold text-brand-warning text-lg">{rental.escrow.toLocaleString()} ر.ي</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button unstyled className="w-full flex items-center justify-between p-4 bg-white border border-brand-border rounded-xl hover:border-brand-primary transition-colors group">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-lg bg-brand-info/10 text-brand-info flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <span className="font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors">عرض العقد الإلكتروني</span>
              </div>
              <ChevronLeft size={20} className="text-brand-text-muted group-hover:text-brand-primary transition-colors" />
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button unstyled className="flex flex-col items-center justify-center p-4 bg-white border border-brand-border rounded-xl hover:bg-brand-content transition-colors">
                <ImageIcon size={24} className="text-brand-text-muted mb-2" />
                <span className="font-bold text-sm text-brand-text-primary">صور التسليم</span>
              </Button>
              <Button unstyled className="flex flex-col items-center justify-center p-4 bg-white border border-brand-border rounded-xl hover:bg-brand-content transition-colors">
                <ImageIcon size={24} className="text-brand-text-muted mb-2" />
                <span className="font-bold text-sm text-brand-text-primary">صور الإرجاع</span>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4 text-brand-text-primary">سجل الحالات</h4>
            <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-brand-success before:via-brand-success before:to-brand-border right-4 w-full pr-4 before:right-6 before:left-auto">
              {['إنشاء الطلب', 'تأكيد المؤجر'].map((label, index) => (
                <div key={label} className="relative flex items-center justify-between w-full pr-8">
                  <div className="absolute right-0 w-6 h-6 bg-brand-success rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10">
                    <CheckCircle size={12} className="text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-brand-text-primary text-sm">{label}</h5>
                    <p className="text-xs text-brand-text-muted mt-1">12 مايو, {index === 0 ? '10:00 ص' : '14:30 م'}</p>
                  </div>
                </div>
              ))}

              <div className="relative flex items-center justify-between w-full pr-8">
                <div className="absolute right-0 w-6 h-6 bg-brand-warning rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div>
                  <h5 className="font-bold text-brand-warning text-sm">جارٍ الاستخدام</h5>
                  <p className="text-xs text-brand-text-muted mt-1">15 مايو, 08:00 ص</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
