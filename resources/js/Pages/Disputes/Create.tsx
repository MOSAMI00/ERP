import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import { AlertCircle, Gavel, ArrowRight, Info, MessageSquare, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function DisputeCreatePage({ handover }: any) {
  const { rental } = handover;

  const form = useForm<any>({
    equipment_handover_id: handover.id,
    rental_op_id: rental.id,
    tenant_claim: '',
    requested_amount: 0, // Amount they think they should be refunded instead
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/disputes');
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/handover/${handover.id}`} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight size={20} />
          </Link>
          <h1 className="font-bold text-lg">فتح نزاع رسمي</h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-danger/5 border border-danger/20 rounded-2xl p-6 mb-8 flex gap-4 items-start">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger flex-shrink-0">
            <Gavel size={24} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-danger">نظام فض النزاعات</h2>
            <p className="text-sm text-danger/80 leading-relaxed">
              عند فتح نزاع، سيقوم فريق الإدارة بمراجعة جميع التقارير والصور المرفوعة من الطرفين (عند الاستلام وعند الإرجاع) للفصل بينكم بشكل عادل.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm mb-6">
          <h3 className="font-bold mb-4">ملخص المطالبة الحالية</h3>
          <div className="flex justify-between items-center p-4 bg-muted rounded-xl">
            <div>
              <div className="text-xs text-muted-foreground font-bold">مبلغ الخصم المطلوب من المالك</div>
              <div className="text-xl font-bold text-danger">{formatCurrency(handover.proposed_deduction)} ر.ي</div>
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground font-bold">من إجمالي تأمين</div>
              <div className="text-lg font-bold">{formatCurrency(rental.insurance_amount)} ر.ي</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-primary" />
              تفاصيل اعتراضك
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-bold">اشرح سبب اعتراضك بوضوح *</label>
                <textarea
                  className="w-full h-40 px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary resize-none"
                  placeholder="مثال: الضرر المذكور كان موجوداً مسبقاً عند الاستلام وتم توثيقه في تقرير الاستلام الأول..."
                  value={form.data.tenant_claim}
                  onChange={e => form.setData('tenant_claim', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold">المبلغ الذي تعتقد أنه عادل للخصم (ر.ي) *</label>
                <div className="relative">
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">ر.ي</div>
                  <input
                    type="number"
                    className="w-full h-12 pr-16 pl-4 rounded-xl border border-border bg-white focus:outline-none focus:border-primary font-bold"
                    value={form.data.requested_amount}
                    onChange={e => form.setData('requested_amount', e.target.value)}
                    max={handover.proposed_deduction}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic">ضع "0" إذا كنت تعترض على الخصم بالكامل</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3 items-start">
            <Info size={18} className="text-primary mt-0.5" />
            <p className="text-xs text-primary/80 leading-relaxed">
              بمجرد إرسال النزاع، سيتم تجميد مبلغ التأمين في حساب الأمانات (Escrow) ولن يتم صرفه لأي طرف حتى يصدر قرار الإدارة النهائي.
            </p>
          </div>

          <button
            type="submit"
            disabled={form.processing}
            className="w-full h-14 bg-danger text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-danger/90 transition-colors"
          >
            {form.processing ? 'جاري الإرسال...' : 'إرسال النزاع للتحقيق'}
          </button>
        </form>
      </main>
    </div>
  );
}
