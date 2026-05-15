import { Flag, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function NotificationsTab() {
  return (
    <div className="p-6 space-y-4 bg-brand-content/50 flex-1 animate-in fade-in duration-300">
      <div className="flex items-start space-x-4 space-x-reverse bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="w-10 h-10 rounded-full bg-brand-danger/10 text-brand-danger flex items-center justify-center shrink-0">
          <AlertTriangle size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-brand-danger text-sm">🔴 نزاع جديد مفتوح</h4>
            <span className="text-xs text-brand-text-muted">منذ 10 دقائق</span>
          </div>
          <p className="text-sm text-brand-text-muted">تم فتح نزاع جديد بواسطة المستأجر "أحمد محمد" حول العملية #OP-2024-0847 بمبلغ 45,000 ر.ي.</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 space-x-reverse bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="w-10 h-10 rounded-full bg-brand-warning/10 text-brand-warning flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-brand-warning text-sm">🟠 نشاط مشبوه</h4>
            <span className="text-xs text-brand-text-muted">منذ ساعة</span>
          </div>
          <p className="text-sm text-brand-text-muted">تم رصد تسجيل دخول من جهاز جديد للمستخدم "شركة البناء" وتغيير معلومات الدفع.</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 space-x-reverse bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="w-10 h-10 rounded-full bg-brand-info/10 text-brand-info flex items-center justify-center shrink-0">
          <Flag size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-brand-info text-sm">🟡 بلاغ جديد</h4>
            <span className="text-xs text-brand-text-muted">منذ ساعتين</span>
          </div>
          <p className="text-sm text-brand-text-muted">قام المستخدم "ياسر علي" بالإبلاغ عن رسائل غير لائقة من المؤجر "علي صالح".</p>
        </div>
      </div>

      <div className="flex items-start space-x-4 space-x-reverse bg-white p-4 rounded-xl border border-brand-border shadow-sm">
        <div className="w-10 h-10 rounded-full bg-brand-success/10 text-brand-success flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-brand-success text-sm">🟢 عملية تأجير مكتملة</h4>
            <span className="text-xs text-brand-text-muted">منذ 3 ساعات</span>
          </div>
          <p className="text-sm text-brand-text-muted">تم استلام المعدة وإغلاق العملية #OP-2024-0846 بنجاح، وجاري تحويل الأرباح.</p>
        </div>
      </div>
    </div>
  );
}
