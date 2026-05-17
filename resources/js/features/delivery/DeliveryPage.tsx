import React, { useEffect, useMemo, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

import {
  EmptyState,
  FilterTabs,
  PageHeader,
} from '../../components/shared';
import { getDeliveryConfig } from './lib/deliveryConfig';
import { DeliveryRentalList } from './ui/DeliveryRentalList';
import { TenantDeliveryDetails } from './ui/TenantDeliveryDetails';
import { OwnerDeliveryDetails } from './ui/OwnerDeliveryDetails';
import { DeliveryReportModal } from './ui/DeliveryReportModal';

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  conditionStatus: 'good',
  hasDamage: 'false',
  notes: '',
  evidencePhotos: [],
};

const STATUS_LABELS = {
  confirmed: 'مؤكد بانتظار الدفع',
  paid: 'جاهز للتسليم',
  in_use: 'قيد الاستخدام',
  return_done: 'تم تأكيد الإرجاع',
  compensation_requested: 'مطالبة تعويض',
  disputed: 'نزاع مفتوح',
  completed: 'مكتمل',
};

function assetUrl(path) {
  if (!path) return null;
  if (typeof path !== 'string') return null;
  if (/^(data:|blob:|https?:\/\/|\/)/.test(path)) return path;
  return `/storage/${path.replace(/^\/+/, '')}`;
}

function firstImage(equipment) {
  const image = equipment?.image
    ?? equipment?.images?.find?.((item) => item?.is_primary)?.image_url
    ?? equipment?.images?.[0]?.image_url
    ?? equipment?.images?.[0]?.url
    ?? equipment?.images?.[0];

  return assetUrl(image) || 'https://placehold.co/160x160/f4f6f9/888?text=Equipment';
}

function enumValue(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'object') return value.value ?? value.name ?? fallback;
  return value;
}

function relationId(record, key) {
  return record?.[key] ?? record?.[`${key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())}`];
}

function normalizeReportImages(report) {
  return ((report?.images ?? []) as any[])
    .map((image) => assetUrl(image?.image_url ?? image?.url ?? image))
    .filter(Boolean);
}

function personName(user, fallback) {
  return user?.full_name ?? user?.name ?? fallback;
}

function money(value) {
  return Number(value ?? 0).toLocaleString('ar-YE');
}

function compensationCondition(status) {
  const value = enumValue(status, 'good');
  if (value === 'damaged' || value === 'partially_damaged') return value;
  return 'good';
}

function normalizeDisputeForDelivery(dispute) {
  if (!dispute) return null;
  const handover = dispute.handover ?? null;
  const ownerRequestedAmount = Number(handover?.proposed_deduction ?? handover?.proposedDeduction ?? 0);
  const adminDecision = enumValue(dispute.admin_decision ?? dispute.adminDecision);
  const rawFinalCompensation = Number(dispute.final_compensation ?? dispute.finalCompensation ?? 0);
  return {
    ...dispute,
    status: enumValue(dispute.status, 'open'),
    adminDecision,
    tenantClaim: dispute.tenant_claim ?? dispute.tenantClaim ?? '',
    tenantProposedAmount: Number(dispute.requested_amount ?? dispute.requestedAmount ?? 0),
    finalCompensation: adminDecision === 'accept_deduction' && rawFinalCompensation === 0 ? ownerRequestedAmount : rawFinalCompensation,
    adminNote: dispute.admin_note ?? dispute.adminNote ?? '',
    ownerRequestedAmount,
  };
}

function normalizeCompensationForDelivery(rawCompensation, rental, reports, disputes) {
  if (!rawCompensation || !rental) return undefined;

  const dispute = normalizeDisputeForDelivery(rawCompensation.dispute ?? disputes[0]);
  const ownerReturnReport = reports.find((report) => enumValue(report.phase) === 'return' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'owner');
  const ownerRequestedAmount = Number(rawCompensation.proposed_deduction ?? rawCompensation.proposedDeduction ?? rawCompensation.requestedAmount ?? 0);
  const adminDecision = dispute?.adminDecision;
  const resolvedFinalAmount = Number(dispute?.finalCompensation ?? 0);
  const finalAmount = dispute?.status === 'resolved'
    ? (adminDecision === 'accept_deduction' && resolvedFinalAmount === 0 ? ownerRequestedAmount : resolvedFinalAmount)
    : ownerRequestedAmount;

  return {
    ...rawCompensation,
    id: rawCompensation.id,
    status: enumValue(rawCompensation.owner_decision ?? rawCompensation.ownerDecision ?? rawCompensation.status, ownerRequestedAmount > 0 ? 'partial_refund' : 'none'),
    ownerRequestedAmount,
    tenantProposedAmount: dispute?.tenantProposedAmount ?? 0,
    finalAmount,
    adminDecision,
    requestedAmount: ownerRequestedAmount,
    notes: rawCompensation.final_notes ?? rawCompensation.finalNotes ?? rawCompensation.notes,
    finalCondition: enumValue(rawCompensation.final_condition ?? rawCompensation.finalCondition),
    lateFee: rawCompensation.late_fee ?? rawCompensation.lateFee,
    actualReturnDate: rawCompensation.actual_return_date ?? rawCompensation.actualReturnDate,
    objectionDeadline: rawCompensation.objection_deadline ?? rawCompensation.objectionDeadline,
    evidencePhotos: normalizeReportImages(ownerReturnReport),
    rentalStatus: enumValue(rental.status),
    dispute,
    isSettled: enumValue(rental.status) === 'completed',
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStageFeedback({ role, stage, rental, compensation, disputes }) {
  const isOwner = role === 'owner';
  const equipmentName = rental?.equipment?.name ?? 'المعدة';
  const partnerName = rental?.partnerName ?? (isOwner ? 'المستأجر' : 'المؤجر');
  const amount = compensation?.requestedAmount ? `${money(compensation.requestedAmount)} ر.ي` : 'مبلغ التعويض';
  const disputeStatus = enumValue(disputes?.[0]?.status);
  const adminDecision = compensation?.adminDecision ?? compensation?.dispute?.adminDecision ?? enumValue(disputes?.[0]?.admin_decision);
  const finalAmount = compensation?.finalAmount ?? disputes?.[0]?.finalCompensation ?? 0;
  const adminDecisionFeedback = {
    accept_deduction: isOwner
      ? `أغلقت الإدارة النزاع بقبول مطالبتك. المبلغ المخصوم لك: ${money(finalAmount || compensation?.requestedAmount || 0)} ر.ي.`
      : `أغلقت الإدارة النزاع بقبول مطالبة المؤجر. المبلغ المخصوم من التأمين: ${money(finalAmount || compensation?.requestedAmount || 0)} ر.ي.`,
    reject_deduction: isOwner
      ? 'أغلقت الإدارة النزاع برفض الخصم. لن يتم تحويل تعويض، وسيعاد التأمين للمستأجر.'
      : 'أغلقت الإدارة النزاع لصالحك. لن يخصم من التأمين وسيتم إرجاعه لك.',
    modify_compensation: `أغلقت الإدارة النزاع بمبلغ معدل: ${money(finalAmount)} ر.ي.`,
  };
  const messages = {
    awaiting_payment: isOwner
      ? `طلب ${equipmentName} مؤكد، لكن التسليم يبدأ بعد إتمام الدفع وتوقيع العقد من ${partnerName}.`
      : `تم قبول طلب ${equipmentName}. أكمل الدفع وتوقيع العقد حتى يبدأ المؤجر إجراءات التسليم.`,
    delivery: isOwner
      ? `وثق حالة ${equipmentName} عند التسليم بالصور والملاحظات؛ هذا التقرير سيكون مرجع العملية عند الإرجاع أو النزاع.`
      : `بانتظار أن يوثق ${partnerName} تسليم ${equipmentName}. ستتمكن من مراجعة التقرير قبل تأكيد الاستلام.`,
    handover: isOwner
      ? `تم إرسال تقرير التسليم إلى ${partnerName}. بانتظار تأكيده لاستلام المعدة.`
      : `راجع صور وملاحظات التسليم الخاصة بـ ${equipmentName}. أكد الاستلام فقط إذا كانت الحالة مطابقة لما استلمته.`,
    in_use: isOwner
      ? `${equipmentName} حالياً لدى ${partnerName}. عند انتهاء الفترة سيظهر تقرير الإرجاع هنا للمراجعة.`
      : `${equipmentName} قيد الاستخدام ضمن هذه العملية. عند الإرجاع ارفع صوراً واضحة وسجل أي ملاحظات قبل التسليم.`,
    return: isOwner
      ? `${partnerName} أرسل تقرير الإرجاع. راجع الصور والملاحظات ثم أكد الاستلام أو اطلب تعويضاً إذا وجدت تلفيات.`
      : `تم إرسال تقرير إرجاع ${equipmentName}. بانتظار مراجعة ${partnerName} وتأكيد الاستلام.`,
    return_done: `تم تأكيد إرجاع ${equipmentName}. يمكن للمؤجر الآن إنهاء العملية أو طلب تعويض إذا كان هناك خصم مبرر.`,
    compensation_requested: isOwner
      ? `تم إرسال مطالبة تعويض بقيمة ${amount}. بانتظار قبول ${partnerName} أو فتح نزاع.`
      : `طلب ${partnerName} تعويضاً بقيمة ${amount}. راجع الملاحظات والصور ثم اقبل الخصم أو افتح نزاعاً موثقاً.`,
    disputes: `يوجد نزاع مفتوح على هذه العملية${disputeStatus ? `، حالته الحالية: ${disputeStatus}.` : '.'}`,
    completed: adminDecisionFeedback[adminDecision] ?? `اكتملت عملية ${equipmentName} وتم إغلاق إجراءات التسليم والإرجاع.`,
  };

  return messages[stage] || 'لا يوجد إجراء مطلوب منك في هذه المرحلة.';
}

function normalizeDeliveryRows({ rentals, role, userId }) {
  return rentals
    .filter((rental) => {
      if (role === 'owner') return relationId(rental, 'owner_id') === userId;
      return relationId(rental, 'tenant_id') === userId;
    })
    .filter((rental) => ['confirmed', 'paid', 'in_use', 'return_done', 'compensation_requested', 'disputed', 'completed'].includes(enumValue(rental.status)))
    .map((rental) => {
      const equipment = rental.equipment ?? {};
      const status = enumValue(rental.status);
      return {
        ...rental,
        status,
        orderNum: rental.orderNum ?? rental.order_num ?? `#${String(rental.id).padStart(5, '0')}`,
        statusLabel: STATUS_LABELS[status] ?? status,
        equipment: {
          ...equipment,
          name: equipment.name ?? 'معدة بدون اسم',
          image: firstImage(equipment),
        },
        partnerName: role === 'owner' ? personName(rental.tenant, 'المستأجر') : personName(rental.owner, 'المؤجر'),
        partnerLabel: role === 'owner' ? 'المستأجر' : 'المؤجر',
        totalAmount: Number(rental.total_amount ?? rental.totalAmount ?? 0),
        insuranceAmount: Number(rental.insurance_amount ?? rental.insuranceAmount ?? 0),
      };
    });
}

function getWorkflowStage(rental, reports, handover) {
  const status = enumValue(rental.status);
  if (status === 'disputed') return 'disputes';
  if (status === 'completed') return 'completed';
  if (status === 'return_done') return 'return_done';
  if (status === 'compensation_requested') return 'compensation_requested';

  const ownerDelivery = reports.some((report) => enumValue(report.phase) === 'delivery' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'owner');
  const tenantDelivery = reports.some((report) => enumValue(report.phase) === 'delivery' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'tenant');
  const tenantReturn = reports.some((report) => enumValue(report.phase) === 'return' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'tenant');
  const ownerReturn = reports.some((report) => enumValue(report.phase) === 'return' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'owner');

  if (status === 'confirmed') return 'awaiting_payment';
  
  if (status === 'paid' && !ownerDelivery) return 'delivery';
  if (status === 'paid' && ownerDelivery && !tenantDelivery) return 'handover';
  if (status === 'in_use' && !tenantReturn) return 'in_use';
  if (status === 'in_use' && tenantReturn && !ownerReturn) return 'return';

  return status;
}

function getFormSpec({ role, stage }) {
  if (stage === 'delivery' && role === 'owner') {
    return { title: 'تسجيل تسليم المعدة', phase: 'delivery', submitter: 'owner', submitLabel: 'تأكيد التسليم' };
  }
  if (stage === 'handover' && role === 'tenant') {
    return { title: 'تأكيد استلام المعدة', phase: 'delivery', submitter: 'tenant', submitLabel: 'تأكيد الاستلام' };
  }
  if (stage === 'in_use' && role === 'tenant') {
    return { title: 'تسجيل إرجاع المعدة', phase: 'return', submitter: 'tenant', submitLabel: 'إرسال تقرير الإرجاع' };
  }
  if (stage === 'return' && role === 'owner') {
    return { title: 'تأكيد إرجاع المعدة', phase: 'return', submitter: 'owner', submitLabel: 'تأكيد الإرجاع' };
  }
  return null;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DeliveryPage({ role: roleProp }) {
  const { props } = usePage();
  const user = (props.auth as any)?.user ?? null;
  const role = roleProp || user?.type || 'tenant';
  const config = getDeliveryConfig(role);
  const userId = user?.id;

  const rentals = (props.rentals as any[]) ?? [];
  const handoverReports = (props.handover_reports as any[]) ?? [];
  const allDisputes = (props.disputes as any[]) ?? [];
  const allCompensations = (props.compensations as any[]) ?? [];
  const allReviews = (props.reviews as any[]) ?? [];

  const routeRentalId = new URLSearchParams(window.location.search).get('id');

  const [activeTab, setActiveTab] = useState(config.tabs[0].id);
  const [selectedRentalId, setSelectedRentalId] = useState(routeRentalId || null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [forms, setForms] = useState({});
  const [compensationForms, setCompensationForms] = useState({});
  const [isSubmittingCompensation, setIsSubmittingCompensation] = useState(false);
  const [isSubmittingStage, setIsSubmittingStage] = useState(false);

  useEffect(() => {
    if (routeRentalId) setSelectedRentalId(routeRentalId);
  }, [routeRentalId]);

  const rows = useMemo(() => {
    const normalizedRentals = normalizeDeliveryRows({ rentals, role, userId });
    return normalizedRentals.map((rental) => {
      const rentalReports = handoverReports.filter(h => relationId(h, 'rental_op_id') === rental.id);
      const rawComp = allCompensations.find(c => (c.rental_op_id ?? c.rentalId) === rental.id) || (rental.equipment_handover ?? rental.equipmentHandover);
      
      const comp = rawComp ? {
        ...rawComp,
        status: enumValue(rawComp.owner_decision ?? rawComp.ownerDecision ?? rawComp.status),
        proposed_deduction: rawComp.proposed_deduction ?? rawComp.proposedDeduction ?? rawComp.requestedAmount,
        rentalStatus: rental.status,
        dispute: rawComp.dispute,
      } : null;
      
      return {
        ...rental,
        workflowStage: getWorkflowStage(rental, rentalReports, comp),
      };
    });
  }, [rentals, role, userId, handoverReports, allCompensations]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    if (activeTab === 'all') return true;
    return row.workflowStage === activeTab;
  }), [activeTab, rows]);

  const selectedRental = useMemo(() => {
    if (selectedRentalId) return rows.find((row) => String(row.id) === String(selectedRentalId)) || filteredRows[0];
    return filteredRows[0];
  }, [filteredRows, rows, selectedRentalId]);

  const reports = selectedRental ? handoverReports.filter(h => relationId(h, 'rental_op_id') === selectedRental.id) : [];
  const disputes = selectedRental ? allDisputes.filter(d => relationId(d, 'rental_op_id') === selectedRental.id).map(normalizeDisputeForDelivery) : [];
  
  const rawCompensation = selectedRental 
    ? (allCompensations.find(c => (c.rental_op_id ?? c.rentalId) === selectedRental.id) 
       || (selectedRental.equipment_handover ?? selectedRental.equipmentHandover)) 
    : undefined;

  const compensation = useMemo(() => {
    if (!rawCompensation || !selectedRental) return undefined;
    return normalizeCompensationForDelivery(rawCompensation, selectedRental, reports, disputes);
  }, [rawCompensation, selectedRental, reports, disputes]);
  
  const ownerReturnReport = reports.find((report) => enumValue(report.phase) === 'return' && enumValue(report.submitted_by_role ?? report.submittedByRole) === 'owner');
  const selectedStage = selectedRental?.workflowStage || 'delivery';
  const formSpec = getFormSpec({ role, stage: selectedStage });
  const activeForm = selectedRental ? { ...DEFAULT_FORM, ...(forms[selectedRental.id] || {}) } : DEFAULT_FORM;
  const activeCompensationForm = selectedRental
    ? { amount: '', notes: '', photos: [], ...(compensationForms[selectedRental.id] || {}) }
    : { amount: '', notes: '', photos: [] };
  const stageFeedback = getStageFeedback({ role, stage: selectedStage, rental: selectedRental, compensation, disputes });

  const tabs = config.tabs.map((tab) => ({
    ...tab,
    count: rows.filter((row) => tab.id === 'all' || row.workflowStage === tab.id).length,
  }));

  const updateForm = (key, value) => {
    if (!selectedRental) return;
    setForms((current) => ({
      ...current,
      [selectedRental.id]: {
        ...DEFAULT_FORM,
        ...(current[selectedRental.id] || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmitStage = () => {
    if (!selectedRental || !formSpec || isSubmittingStage) return;

    setIsSubmittingStage(true);
    router.post('/handover-reports', {
      rental_op_id: selectedRental.id,
      phase: formSpec.phase,
      condition_status: activeForm.conditionStatus || 'good',
      has_issues: activeForm.hasDamage === 'true' || ['damaged', 'partially_damaged'].includes(activeForm.conditionStatus),
      notes: activeForm.notes,
      images: activeForm.evidencePhotos,
    }, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setForms((current) => ({ ...current, [selectedRental.id]: DEFAULT_FORM }));
      },
      onFinish: () => {
        setIsSubmittingStage(false);
      }
    });
  };

  const updateCompensationForm = (key, value) => {
    if (!selectedRental) return;
    setCompensationForms((current) => ({
      ...current,
      [selectedRental.id]: {
        amount: '',
        notes: '',
        photos: [],
        ...(current[selectedRental.id] || {}),
        [key]: value,
      },
    }));
  };

  const handleRequestCompensation = (action = 'submit') => {
    if (!selectedRental || !ownerReturnReport || isSubmittingCompensation) return;
    const handover = selectedRental.equipment_handover ?? selectedRental.equipmentHandover;
    if (!handover?.id) return;

    if (action === 'skip') {
      if (!confirm('هل أنت متأكد أنك لا تريد طلب تعويض؟ سيتم إكمال العملية وإعادة مبلغ التأمين للمستأجر.')) return;
      
      setIsSubmittingCompensation(true);
      router.post(`/equipment-handovers/${handover.id}/decide`, {
        owner_decision: 'full_refund',
        final_condition: activeForm.conditionStatus || 'good',
        final_notes: 'اختار المؤجر عدم طلب تعويض.',
      }, {
        preserveScroll: true,
        onFinish: () => setIsSubmittingCompensation(false)
      });
      return;
    }

    const amount = Number(activeCompensationForm.amount || 0);
    if (!amount || !activeCompensationForm.notes.trim()) return;

    setIsSubmittingCompensation(true);
    const insuranceAmount = Number(selectedRental.insurance_amount ?? selectedRental.insuranceAmount ?? 0);
    router.post(`/equipment-handovers/${handover.id}/decide`, {
      owner_decision: (insuranceAmount > 0 && amount >= insuranceAmount)
        ? 'no_refund'
        : 'partial_refund',
      proposed_deduction: amount,
      final_condition: compensationCondition(ownerReturnReport.condition_status ?? ownerReturnReport.conditionStatus),
      final_notes: activeCompensationForm.notes.trim(),
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setCompensationForms((current) => ({
          ...current,
          [selectedRental.id]: { amount: '', notes: '', photos: [] },
        }));
      },
      onFinish: () => {
        setIsSubmittingCompensation(false);
      }
    });
  };

  const respondToCompensation = (compensationId, action) => {
    if (!selectedRental) return;
    const handover = selectedRental.equipment_handover ?? selectedRental.equipmentHandover;
    if (!handover?.id) return;

    if (action === 'accepted') {
      router.post(`/equipment-handovers/${handover.id}/respond`, {
        decision: 'accepted',
      }, { preserveScroll: true });
    }
  };

  const openCompensationDispute = (compensationId, claim = '', amount = 0) => {
    if (!selectedRental) return;
    const handover = selectedRental.equipment_handover ?? selectedRental.equipmentHandover;
    if (!handover?.id) return;
    router.post('/disputes', {
      rental_op_id: selectedRental.id,
      equipment_handover_id: handover.id,
      tenant_claim: claim || 'أعترض على مطالبة التعويض وأطلب مراجعة الإدارة للمحاضر والصور.',
      requested_amount: amount,
    }, { preserveScroll: true });
  };

  const handleSubmitRating = ({ rental, rating, comment }) => {
    if (!rental) return;
    const equipment = rental.equipment;
    router.post('/reviews', {
      rental_op_id: rental.id,
      target_type: 'user',
      target_id: role === 'owner' ? (rental.tenant_id ?? rental.tenantId) : (equipment?.owner_id ?? equipment?.ownerId),
      rating,
      review_text: comment || '',
    }, { preserveScroll: true });
  };

  return (
    <div className={config.containerClassName} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={config.description}
      />

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredRows.length === 0 ? (
        <EmptyState
          icon="📦"
          title="لا توجد عمليات في هذه الحالة"
          description="ستظهر عمليات التسليم والإرجاع هنا عند توفرها."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,420px)_1fr]">
          <DeliveryRentalList
            rentals={filteredRows}
            selectedRental={selectedRental}
            onSelect={setSelectedRentalId}
          />

          {selectedRental ? (
            role === 'tenant' ? (
              <TenantDeliveryDetails
                rental={selectedRental}
                stage={selectedStage}
                reports={reports}
                disputes={disputes}
                compensation={compensation}
                formSpec={formSpec}
                activeForm={activeForm}
                stageFeedback={stageFeedback}
                onUpdateForm={updateForm}
                onSubmitStage={handleSubmitStage}
                onRespondCompensation={respondToCompensation}
                onOpenCompensationDispute={openCompensationDispute}
                onSelectReport={setSelectedReport}
                onSubmitRating={handleSubmitRating}
                hasReview={allReviews.some(r => (r.rental_op_id ?? r.rentalId) === selectedRental.id)}
                isSubmittingStage={isSubmittingStage}
              />
            ) : (
              <OwnerDeliveryDetails
                rental={selectedRental}
                stage={selectedStage}
                reports={reports}
                disputes={disputes}
                compensation={compensation}
                formSpec={formSpec}
                activeForm={activeForm}
                activeCompensationForm={activeCompensationForm}
                stageFeedback={stageFeedback}
                isSubmitting={isSubmittingCompensation}
                onUpdateForm={updateForm}
                onSubmitStage={handleSubmitStage}
                onUpdateCompensationForm={updateCompensationForm}
                onRequestCompensation={handleRequestCompensation}
                onSelectReport={setSelectedReport}
                onSubmitRating={handleSubmitRating}
                hasReview={allReviews.some(r => (r.rental_op_id ?? r.rentalId) === selectedRental.id)}
                isSubmittingStage={isSubmittingStage}
              />
            )
          ) : null}
        </div>
      )}

      <DeliveryReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
