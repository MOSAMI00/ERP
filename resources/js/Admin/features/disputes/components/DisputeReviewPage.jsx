import { AlertCircle, Eye, ArrowRight, ShieldAlert, FileText, Upload, Camera, FileCheck2, Scale } from 'lucide-react';
import { useState } from 'react';

export default function DisputeReviewPage({
  dispute,
  decision,
  setDecision,
  adjustedAmount,
  setAdjustedAmount,
  onCloseReview,
  onResolve,
}) {
  const [adminNote, setAdminNote] = useState('');
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={onCloseReview} className="p-2 text-brand-text-muted hover:text-brand-primary bg-brand-content rounded-lg transition-colors">
            <ArrowRight size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-brand-text-primary flex items-center">
              مراجعة النزاع
              <span className="text-sm font-normal text-brand-text-muted ml-2 mr-2" dir="ltr">{dispute.id}</span>
            </h2>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-brand-${dispute.statusColor}/10 text-brand-${dispute.statusColor}`}>
          {dispute.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <ShieldAlert size={20} className="text-brand-warning ml-2" /> بيانات الطرفين
          </h3>
          
          <div className="bg-brand-info/5 p-4 rounded-xl border border-brand-info/20">
            <span className="text-xs font-bold text-brand-info bg-brand-info/10 px-2 py-1 rounded mb-3 inline-block">👤 المستأجر</span>
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-brand-text-primary">{dispute.tenant}</p>
              <span className="text-xs font-bold text-brand-text-primary">⭐ 4.5</span>
            </div>
            <p className="text-sm text-brand-text-muted mb-3" dir="ltr">+967 771 234 567</p>
            <div className="bg-white p-3 rounded-lg border border-brand-border/50 text-sm">
              <span className="font-bold text-brand-danger block mb-1">اعتراض المستأجر:</span>
              "المعدة تعطلت في اليوم الثاني من الإيجار، والمؤجر يطالب بخصم مبلغ التأمين بحجة سوء الاستخدام وهو غير صحيح."
            </div>
          </div>

          <div className="bg-brand-success/5 p-4 rounded-xl border border-brand-success/20">
            <span className="text-xs font-bold text-brand-success bg-brand-success/10 px-2 py-1 rounded mb-3 inline-block">🏠 المؤجر</span>
            <div className="flex justify-between items-start mb-2">
              <p className="font-bold text-brand-text-primary">{dispute.owner}</p>
              <span className="text-xs font-bold text-brand-text-primary">⭐ 4.8</span>
            </div>
            <p className="text-sm text-brand-text-muted mb-3" dir="ltr">+967 731 234 567</p>
            <div className="bg-white p-3 rounded-lg border border-brand-border/50 text-sm mb-3">
              <span className="font-bold text-brand-warning block mb-1">ملاحظات المؤجر:</span>
              "تم تسليم المعدة بحالة ممتازة والصور تثبت ذلك. العطل ناتج عن تحميل زائد من قبل المستأجر."
            </div>
            <p className="text-sm font-bold bg-white p-2 rounded-lg border border-brand-border text-center">
              الخصم المطلوب: <span className="text-brand-danger">{dispute.amount.toLocaleString()} ر.ي</span>
            </p>
          </div>
        </div>

        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <Camera size={20} className="text-brand-info ml-2" /> الأدلة والصور
          </h3>
          
          <div>
            <p className="text-sm font-bold mb-3 flex items-center"><Upload size={16} className="ml-1 text-brand-text-muted" /> صور التسليم (المؤجر)</p>
            <div className="grid grid-cols-2 gap-2">
              <img src="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=200&h=200" alt="تسليم 1" className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-brand-border" />
              <img src="https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80&w=200&h=200" alt="تسليم 2" className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-brand-border" />
            </div>
            <p className="text-xs text-brand-text-muted mt-2">التاريخ: 15 مايو 2024, 08:00 ص</p>
          </div>

          <div>
            <p className="text-sm font-bold mb-3 flex items-center"><FileCheck2 size={16} className="ml-1 text-brand-text-muted" /> صور الإرجاع / العطل (المستأجر)</p>
            <div className="grid grid-cols-2 gap-2">
              <img src="https://images.unsplash.com/photo-1572097092892-dbd9633e6020?auto=format&fit=crop&q=80&w=200&h=200" alt="إرجاع 1" className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border border-brand-border" />
              <div className="w-full h-24 bg-brand-content rounded-lg flex items-center justify-center border border-brand-border border-dashed text-brand-text-muted text-xs">
                لا توجد صورة إضافية
              </div>
            </div>
            <p className="text-xs text-brand-text-muted mt-2">التاريخ: 17 مايو 2024, 14:30 م</p>
          </div>

          <button className="w-full flex items-center justify-between p-3 bg-brand-content border border-brand-border rounded-lg hover:border-brand-primary transition-colors group">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FileText size={18} className="text-brand-info" />
              <span className="font-bold text-sm text-brand-text-primary group-hover:text-brand-primary transition-colors">عرض العقد الإلكتروني</span>
            </div>
            <Eye size={16} className="text-brand-text-muted" />
          </button>
        </div>

        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6 flex flex-col">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <Scale size={20} className="text-brand-primary ml-2" /> اتخاذ القرار
          </h3>
          
          <div className="bg-brand-content p-4 rounded-xl border border-brand-border flex justify-between items-center">
            <span className="text-sm font-bold text-brand-text-primary">مبلغ النزاع الإجمالي</span>
            <span className="text-xl font-bold text-brand-danger">{dispute.amount.toLocaleString()} <span className="text-sm">ر.ي</span></span>
          </div>

          <div className="space-y-4 flex-1">
            <label className="block text-sm font-bold text-brand-text-primary mb-2">القرار الإداري:</label>
            
            <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'accept' ? 'bg-brand-success/10 border-brand-success' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
              <input type="radio" name="decision" checked={decision === 'accept'} onChange={() => setDecision('accept')} className="mt-0.5 text-brand-success focus:ring-brand-success" />
              <div className="mr-3">
                <span className="block font-bold text-sm">قبول الخصم كاملاً</span>
                <span className="block text-xs text-brand-text-muted mt-1">سيتم خصم المبلغ من التأمين وتحويله للمؤجر.</span>
              </div>
            </label>

            <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'reject' ? 'bg-brand-danger/10 border-brand-danger' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
              <input type="radio" name="decision" checked={decision === 'reject'} onChange={() => setDecision('reject')} className="mt-0.5 text-brand-danger focus:ring-brand-danger" />
              <div className="mr-3">
                <span className="block font-bold text-sm">رفض الخصم</span>
                <span className="block text-xs text-brand-text-muted mt-1">سيتم إرجاع كامل مبلغ التأمين للمستأجر.</span>
              </div>
            </label>

            <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'adjust' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
              <input type="radio" name="decision" checked={decision === 'adjust'} onChange={() => setDecision('adjust')} className="mt-0.5 text-brand-primary focus:ring-brand-primary" />
              <div className="mr-3 w-full">
                <span className="block font-bold text-sm">تعديل قيمة التعويض</span>
                {decision === 'adjust' && (
                  <div className="mt-3 relative">
                    <input 
                      type="number" 
                      value={adjustedAmount}
                      onChange={(e) => setAdjustedAmount(e.target.value)}
                      className="w-full pl-12 pr-4 py-2 border border-brand-primary rounded-md focus:outline-none focus:ring-1 focus:ring-brand-primary text-sm" 
                    />
                    <span className="absolute left-3 top-2 text-brand-text-muted text-sm">ر.ي</span>
                  </div>
                )}
              </div>
            </label>

            <div className="pt-2">
              <label className="block text-sm font-bold text-brand-text-primary mb-2">ملاحظة إدارية (إلزامية)</label>
              <textarea 
                className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary bg-brand-content h-24 resize-none" 
                placeholder="اكتب أسباب القرار هنا..."
                value={adminNote}
                onChange={(event) => setAdminNote(event.target.value)}
                required
              ></textarea>
            </div>
          </div>

          <div className="pt-4 mt-auto space-y-4">
            <div className="flex items-start space-x-2 space-x-reverse bg-brand-warning/10 p-3 rounded-lg border border-brand-warning/20">
              <AlertCircle size={16} className="text-brand-warning shrink-0 mt-0.5" />
              <p className="text-xs text-brand-warning font-bold">⚠️ سيُنفَّذ القرار المالي تلقائياً وسيتم إشعار الطرفين عبر التطبيق والبريد الإلكتروني.</p>
            </div>

            <div className="flex space-x-3 space-x-reverse">
              <button onClick={onCloseReview} className="w-1/3 py-3 bg-white border border-brand-border text-brand-text-primary rounded-lg font-bold text-sm hover:bg-brand-content transition-colors">
                إلغاء
              </button>
              <button
                onClick={() => {
                  if (!adminNote.trim()) return;
                  onResolve(adminNote.trim());
                }}
                className="w-2/3 py-3 bg-brand-primary text-white rounded-lg font-bold text-sm hover:bg-brand-primary/90 transition-colors shadow-sm"
              >
                تأكيد القرار الإداري
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
