import React, { useState } from 'react';
import { useForm, router, Link } from '@inertiajs/react';
import {
  CheckCircle2, AlertTriangle, FileText, Image as ImageIcon,
  ArrowRight, ShieldCheck, DollarSign, Info, MessageSquare, Clock
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function HandoverShowPage({ rental, handover, auth }: any) {
  const isOwner = auth.user.id === rental.owner_id;
  const isTenant = auth.user.id === rental.tenant_id;

  const [activeTab, setActiveTab] = useState('summary');
  const [ownerDecision, setOwnerDecision] = useState('full_refund'); // full_refund, partial_refund, no_refund

  const form = useForm<any>({
    owner_decision: 'full_refund',
    final_condition: 'good',
    proposed_deduction: 0,
    final_notes: '',
  });

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    form.post(`/handover/${handover.id}/decide`);
  };

  const handleTenantAction = (action) => {
    if (action === 'accept') {
      if (confirm('هل أنت متأكد من قبول التعويض المقترح؟ سيتم خصم المبلغ من التأمين فوراً.')) {
        router.post(`/handover/${handover.id}/accept`);
      }
    } else if (action === 'dispute') {
      router.visit(`/disputes/create/${handover.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={`/rentals/${rental.id}`} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowRight size={20} />
          </Link>
          <h1 className="font-bold text-lg">تقييم حالة المعدة</h1>
          <div className="w-10" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Reports Summary */}
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
              <div className="flex border-b border-border">
                <button
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'summary' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted'}`}
                  onClick={() => setActiveTab('summary')}
                >
                  ملخص التقارير
                </button>
                <button
                  className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'evidence' ? 'text-primary bg-primary/5 border-b-2 border-primary' : 'text-muted-foreground hover:bg-muted'}`}
                  onClick={() => setActiveTab('evidence')}
                >
                  الصور والأدلة
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'summary' ? (
                  <div className="space-y-8">
                    {/* Tenant Report */}
                    <div className="relative pr-6 border-r-2 border-primary/20">
                      <div className="absolute top-0 -right-[9px] w-4 h-4 rounded-full bg-primary" />
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">تقرير المستأجر</span>
                        <span className="text-xs text-muted-foreground">عند الإرجاع</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {rental.handover_reports?.find(r => r.submitted_by_role === 'tenant' && r.phase === 'return')?.condition_notes || 'لم يتم رفع التقرير بعد'}
                      </p>
                    </div>

                    {/* Owner Report */}
                    <div className="relative pr-6 border-r-2 border-success/20">
                      <div className="absolute top-0 -right-[9px] w-4 h-4 rounded-full bg-success" />
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-success px-2 py-0.5 bg-success/10 rounded-full">تقرير المالك</span>
                        <span className="text-xs text-muted-foreground">عند الاستلام</span>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/80">
                        {rental.handover_reports?.find(r => r.submitted_by_role === 'owner' && r.phase === 'return')?.condition_notes || 'لم يتم رفع التقرير بعد'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {/* Map through all images from reports */}
                    {rental.handover_reports?.flatMap(r => r.images || []).map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-xl bg-muted border border-border overflow-hidden">
                        <img src={img.image_url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Decision Section (Owner View) */}
            {isOwner && handover.owner_decision === null && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" />
                  اتخاذ قرار بشأن التأمين
                </h3>
                <form onSubmit={handleDecisionSubmit} className="space-y-6">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'full_refund', label: 'إرجاع التأمين كاملاً', icon: CheckCircle2, color: 'text-success' },
                      { value: 'partial_refund', label: 'خصم جزئي', icon: AlertTriangle, color: 'text-warning' },
                      { value: 'no_refund', label: 'خصم التأمين كاملاً', icon: ShieldCheck, color: 'text-danger' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => form.setData('owner_decision', opt.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${form.data.owner_decision === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                      >
                        <opt.icon size={20} className={opt.color} />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>

                  {form.data.owner_decision === 'partial_refund' && (
                    <div className="space-y-2">
                      <label className="block text-sm font-bold">مبلغ الخصم المقترح (ر.ي) *</label>
                      <div className="relative">
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">ر.ي</div>
                        <input
                          type="number"
                          className="w-full h-12 pr-16 pl-4 rounded-xl border border-border bg-white focus:outline-none focus:border-primary font-bold"
                          value={form.data.proposed_deduction}
                          onChange={e => form.setData('proposed_deduction', e.target.value)}
                          max={rental.insurance_amount}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">الحد الأقصى هو مبلغ التأمين: {formatCurrency(rental.insurance_amount)} ر.ي</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="block text-sm font-bold">ملاحظات نهائية (اختياري)</label>
                    <textarea
                      className="w-full h-24 px-4 py-3 rounded-xl border border-border bg-white focus:outline-none focus:border-primary resize-none"
                      placeholder="ذكر سبب الخصم أو أي ملاحظات للمستأجر..."
                      value={form.data.final_notes}
                      onChange={e => form.setData('final_notes', e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full h-13 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors"
                  >
                    تأكيد وإرسال القرار للمستأجر
                  </button>
                </form>
              </div>
            )}

            {/* Tenant Objection Section */}
            {isTenant && handover.proposed_deduction > 0 && rental.status !== 'completed' && rental.status !== 'disputed' && (
              <div className="bg-white rounded-2xl border border-border p-6 shadow-sm border-t-4 border-t-warning">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center text-warning flex-shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">طلب تعويض من المالك</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      قام المالك بطلب خصم مبلغ <span className="font-bold text-danger">{formatCurrency(handover.proposed_deduction)} ر.ي</span> من التأمين بسبب ملاحظات على حالة المعدة.
                    </p>
                  </div>
                </div>

                {handover.final_notes && (
                  <div className="bg-muted/50 p-4 rounded-xl mb-6 border border-border italic text-sm">
                    "{handover.final_notes}"
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleTenantAction('accept')}
                    className="flex-1 h-12 bg-success text-white rounded-xl font-bold hover:bg-success/90 transition-colors"
                  >
                    قبول الخصم والتسوية
                  </button>
                  <button
                    onClick={() => handleTenantAction('dispute')}
                    className="flex-1 h-12 bg-danger text-white rounded-xl font-bold hover:bg-danger/90 transition-colors"
                  >
                    فتح نزاع واعتراض
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Summary Sidebar */}
            <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
              <h3 className="font-bold mb-4">ملخص الإيجار</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-bold">مبلغ التأمين المحجوز</div>
                    <div className="font-bold">{formatCurrency(rental.insurance_amount)} ر.ي</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Clock size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-bold">فترة الإيجار الفعلية</div>
                    <div className="font-bold">{rental.duration_days} أيام</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Deadline Warning */}
            {handover.objection_deadline && rental.status !== 'completed' && (
              <div className="p-4 rounded-2xl bg-danger/5 border border-danger/10 flex items-start gap-3">
                <Info className="text-danger mt-1" size={18} />
                <div className="text-xs leading-relaxed">
                  <div className="font-bold text-danger">تنبيه المهلة النهائية</div>
                  <div className="text-danger/80">
                    سيتم خصم المبلغ آلياً وتأكيد التسوية في حال عدم الرد خلال:
                    <span className="font-bold block mt-1">
                      {new Date(handover.objection_deadline).toLocaleString('ar-YE')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
