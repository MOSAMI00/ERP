import { AlertCircle, ArrowRight, Camera, CheckCircle2, FileCheck2, FileText, Scale, ShieldAlert, Upload } from 'lucide-react';
import { useState } from 'react';

const money = (value) => Number(value ?? 0).toLocaleString();

const decisionLabels = {
  accept_deduction: 'اعتماد مبلغ المؤجر كاملاً',
  reject_deduction: 'رفض خصم المؤجر وإرجاع التأمين',
  modify_compensation: 'اعتماد مبلغ معدل من الإدارة',
};

const conditionLabels = {
  excellent: 'ممتازة',
  good: 'جيدة',
  fair: 'متوسطة',
  damaged: 'متضررة',
  partially_damaged: 'متضررة جزئياً',
};

function PartyCard({ tone, title, user, noteTitle, note }) {
  const toneClasses = tone === 'tenant'
    ? 'bg-brand-info/5 border-brand-info/20 text-brand-info'
    : 'bg-brand-success/5 border-brand-success/20 text-brand-success';

  return (
    <div className={`p-4 rounded-xl border ${toneClasses}`}>
      <span className="text-xs font-bold bg-white/70 px-2 py-1 rounded mb-3 inline-block">{title}</span>
      <div className="flex justify-between items-start mb-2 gap-3">
        <p className="font-bold text-brand-text-primary">{user?.name ?? 'غير محدد'}</p>
        <span className="text-xs text-brand-text-muted">{user?.email ?? ''}</span>
      </div>
      <p className="text-sm text-brand-text-muted mb-3" dir="ltr">{user?.phone ?? '—'}</p>
      <div className="bg-white p-3 rounded-lg border border-brand-border/50 text-sm text-brand-text-primary">
        <span className="font-bold block mb-1">{noteTitle}</span>
        {note || 'لا توجد ملاحظات مسجلة.'}
      </div>
    </div>
  );
}

function EvidenceGroup({ title, icon: Icon, reports }) {
  const images = reports.flatMap((report) => report.images ?? []);

  return (
    <div>
      <p className="text-sm font-bold mb-3 flex items-center">
        <Icon size={16} className="ml-1 text-brand-text-muted" />
        {title}
      </p>
      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <a key={`${image}-${index}`} href={image} target="_blank" rel="noreferrer" className="block">
              <img src={image} alt={`${title} ${index + 1}`} className="w-full h-24 object-cover rounded-lg hover:opacity-80 transition-opacity border border-brand-border" />
            </a>
          ))}
        </div>
      ) : (
        <div className="h-24 bg-brand-content rounded-lg flex items-center justify-center border border-brand-border border-dashed text-brand-text-muted text-xs">
          لا توجد صور مرفوعة
        </div>
      )}
      <div className="mt-2 space-y-1">
        {reports.length > 0 ? reports.map((report) => (
          <p key={report.id} className="text-xs text-brand-text-muted">
            {report.submitted_by_role === 'owner' ? 'المؤجر' : 'المستأجر'}:
            {' '}
            {conditionLabels[report.condition_status] ?? report.condition_status ?? 'غير محدد'}
            {report.notes ? ` - ${report.notes}` : ''}
          </p>
        )) : (
          <p className="text-xs text-brand-text-muted">لا توجد محاضر مسجلة لهذه المرحلة.</p>
        )}
      </div>
    </div>
  );
}

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
  const isResolved = dispute.status === 'resolved';
  const deliveryReports = (dispute.reports ?? []).filter((report) => report.phase === 'delivery');
  const returnReports = (dispute.reports ?? []).filter((report) => report.phase === 'return');
  const handover = dispute.handover ?? {};
  const ownerRequestedAmount = dispute.ownerRequestedAmount ?? Number(handover.proposed_deduction ?? 0);
  const tenantProposedAmount = dispute.tenantProposedAmount ?? dispute.requestedAmount ?? 0;
  const finalCompensation = dispute.finalCompensation ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-brand-card p-4 rounded-xl shadow-sm border border-brand-border">
        <div className="flex items-center space-x-4 space-x-reverse">
          <button onClick={onCloseReview} className="p-2 text-brand-text-muted hover:text-brand-primary bg-brand-content rounded-lg transition-colors">
            <ArrowRight size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-brand-text-primary flex items-center">
              مراجعة النزاع
              <span className="text-sm font-normal text-brand-text-muted ml-2 mr-2" dir="ltr">D-{dispute.id}</span>
            </h2>
            <p className="text-sm text-brand-text-muted mt-1">{dispute.eq} - العملية #{dispute.rental?.id ?? dispute.rental_op_id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold bg-brand-${dispute.statusColor}/10 text-brand-${dispute.statusColor}`}>
          {dispute.statusLabel ?? dispute.status}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <ShieldAlert size={20} className="text-brand-warning ml-2" /> بيانات الطرفين
          </h3>

          <PartyCard
            tone="tenant"
            title="المستأجر"
            user={dispute.rental?.tenant}
            noteTitle="اعتراض المستأجر"
            note={dispute.tenantClaim}
          />

          <PartyCard
            tone="owner"
            title="المؤجر"
            user={dispute.rental?.owner}
            noteTitle="ملاحظات المؤجر"
            note={dispute.ownerNotes}
          />

          <div className="bg-brand-content p-4 rounded-xl border border-brand-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-muted">المبلغ المطلوب من المؤجر</span>
              <span className="font-bold text-brand-danger">{money(ownerRequestedAmount)} ر.ي</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-muted">المبلغ المقترح من المستأجر</span>
              <span className="font-bold text-brand-warning">{money(tenantProposedAmount)} ر.ي</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-text-muted">مبلغ التأمين</span>
              <span className="font-bold text-brand-text-primary">{money(dispute.rental?.insurance_amount)} ر.ي</span>
            </div>
          </div>
        </div>

        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <Camera size={20} className="text-brand-info ml-2" /> الأدلة والمحاضر
          </h3>

          <EvidenceGroup title="صور ومحضر التسليم" icon={Upload} reports={deliveryReports} />
          <EvidenceGroup title="صور ومحضر الإرجاع" icon={FileCheck2} reports={returnReports} />

          <div className="w-full flex items-center justify-between p-3 bg-brand-content border border-brand-border rounded-lg">
            <div className="flex items-center space-x-2 space-x-reverse">
              <FileText size={18} className="text-brand-info" />
              <span className="font-bold text-sm text-brand-text-primary">حالة الفحص النهائية</span>
            </div>
            <span className="text-sm font-bold text-brand-text-muted">
              {conditionLabels[handover.final_condition] ?? handover.final_condition ?? 'غير محدد'}
            </span>
          </div>
        </div>

        <div className="bg-brand-card rounded-xl p-6 shadow-sm border border-brand-border space-y-6 flex flex-col">
          <h3 className="text-lg font-bold text-brand-text-primary border-b border-brand-border pb-3 flex items-center">
            <Scale size={20} className="text-brand-primary ml-2" /> اتخاذ القرار
          </h3>

          <div className="bg-brand-content p-4 rounded-xl border border-brand-border flex justify-between items-center">
            <span className="text-sm font-bold text-brand-text-primary">{isResolved ? 'المبلغ النهائي حسب قرار الإدارة' : 'المبلغ المطلوب من المؤجر'}</span>
            <span className={`text-xl font-bold ${isResolved ? 'text-brand-success' : 'text-brand-danger'}`}>
              {money(isResolved ? finalCompensation : ownerRequestedAmount)} <span className="text-sm">ر.ي</span>
            </span>
          </div>

          {isResolved ? (
            <div className="space-y-4 flex-1">
              <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl p-4">
                <p className="font-bold text-brand-success flex items-center">
                  <CheckCircle2 size={18} className="ml-2" />
                  تمت التسوية بقرار إداري
                </p>
                <p className="text-sm text-brand-text-primary mt-3">
                  القرار: {decisionLabels[dispute.adminDecision] ?? dispute.adminDecision ?? 'غير محدد'}
                </p>
                <p className="text-sm text-brand-text-primary mt-2">
                  مبلغ المؤجر الأصلي: {money(ownerRequestedAmount)} ر.ي
                </p>
                <p className="text-sm text-brand-text-primary mt-2">
                  اقتراح المستأجر: {money(tenantProposedAmount)} ر.ي
                </p>
                <p className="text-sm text-brand-text-primary mt-2">
                  المبلغ النهائي المخصوم من التأمين: {money(finalCompensation)} ر.ي
                </p>
                <p className="text-sm text-brand-text-muted mt-3">{dispute.adminNote || 'لا توجد ملاحظة إدارية.'}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              <label className="block text-sm font-bold text-brand-text-primary mb-2">القرار الإداري:</label>

              <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'accept' ? 'bg-brand-success/10 border-brand-success' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
                <input type="radio" name="decision" checked={decision === 'accept'} onChange={() => setDecision('accept')} className="mt-0.5 text-brand-success focus:ring-brand-success" />
                <div className="mr-3">
                  <span className="block font-bold text-sm">قبول الخصم كاملاً</span>
                  <span className="block text-xs text-brand-text-muted mt-1">سيتم اعتماد مبلغ المؤجر: {money(ownerRequestedAmount)} ر.ي.</span>
                </div>
              </label>

              <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'reject' ? 'bg-brand-danger/10 border-brand-danger' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
                <input type="radio" name="decision" checked={decision === 'reject'} onChange={() => setDecision('reject')} className="mt-0.5 text-brand-danger focus:ring-brand-danger" />
                <div className="mr-3">
                  <span className="block font-bold text-sm">رفض الخصم</span>
                  <span className="block text-xs text-brand-text-muted mt-1">سيكون المبلغ النهائي 0 ر.ي، ويعاد التأمين للمستأجر.</span>
                </div>
              </label>

              <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${decision === 'adjust' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-white border-brand-border hover:bg-brand-content'}`}>
                <input type="radio" name="decision" checked={decision === 'adjust'} onChange={() => setDecision('adjust')} className="mt-0.5 text-brand-primary focus:ring-brand-primary" />
                <div className="mr-3 w-full">
                  <span className="block font-bold text-sm">تعديل قيمة التعويض</span>
                  <span className="block text-xs text-brand-text-muted mt-1">اكتب مبلغ الإدارة النهائي بين اقتراح الطرفين أو حسب الأدلة.</span>
                  {decision === 'adjust' && (
                    <div className="mt-3 relative">
                      <input
                        type="number"
                        min="0"
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
                />
              </div>
            </div>
          )}

          {!isResolved && (
            <div className="pt-4 mt-auto space-y-4">
              <div className="flex items-start space-x-2 space-x-reverse bg-brand-warning/10 p-3 rounded-lg border border-brand-warning/20">
                <AlertCircle size={16} className="text-brand-warning shrink-0 mt-0.5" />
                <p className="text-xs text-brand-warning font-bold">سيُنفَّذ القرار المالي تلقائياً وسيتم إشعار الطرفين.</p>
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
          )}
        </div>
      </div>
    </div>
  );
}
