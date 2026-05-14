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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStageFeedback({ role, stage }) {
  const isOwner = role === 'owner';
  const messages = {
    awaiting_payment: 'بانتظار قيام المستأجر بالدفع وتوقيع العقد حتى تتمكن من تسليم المعدة.',
    delivery: isOwner
      ? 'يرجى توثيق تسليم المعدة بالصور وتعبئة حالة المعدة حتى ينتقل الطلب إلى قيد التسليم.'
      : 'يرجى الانتظار حتى يقوم المؤجر بتسليم المعدة وتوثيقها أولًا.',
    handover: isOwner
      ? 'تم توثيق التسليم. يرجى الانتظار حتى يؤكد المستأجر استلام المعدة.'
      : 'المؤجر وثق التسليم. راجع التقرير ثم أكد الاستلام إذا كانت البيانات صحيحة.',
    in_use: isOwner
      ? 'المعدة الآن لدى المستأجر. يرجى الانتظار حتى يرسل المستأجر تقرير الإرجاع.'
      : 'المعدة قيد الاستخدام. عند انتهاء مدة الإيجار، ارفع صور الإرجاع وسجل التقرير.',
    return: isOwner
      ? 'المستأجر أرسل تقرير الإرجاع. راجع الصور والملاحظات ثم أكد الإرجاع.'
      : 'تم إرسال تقرير الإرجاع. يرجى الانتظار حتى يؤكد المؤجر استلام المعدة.',
    disputes: 'يوجد نزاع على هذه العملية. تابع التفاصيل والردود قبل إكمال أي إجراء.',
    completed: 'اكتملت عملية التسليم والإرجاع ولا توجد إجراءات مطلوبة.',
  };

  return messages[stage] || 'لا يوجد إجراء مطلوب منك في هذه المرحلة.';
}

function normalizeDeliveryRows({ rentals, role, userId }) {
  return rentals
    .filter((rental) => {
      if (role === 'owner') return (rental.owner_id ?? rental.ownerId) === userId;
      return (rental.tenant_id ?? rental.tenantId) === userId;
    })
    .filter((rental) => ['confirmed', 'paid', 'in_use', 'disputed', 'completed'].includes(rental.status))
    .map((rental) => {
      return {
        ...rental,
        partnerName: role === 'owner' ? (rental.tenant?.full_name ?? rental.tenant?.name ?? 'المستأجر') : (rental.equipment?.owner?.full_name ?? rental.equipment?.owner_name ?? 'المؤجر'),
        partnerLabel: role === 'owner' ? 'المستأجر' : 'المؤجر',
      };
    });
}

function getWorkflowStage(rental, reports, handover) {
  if (rental.status === 'disputed') return 'disputes';
  
  // A rental is in 'disputes' stage if there's an active compensation request or a formal dispute
  const hasCompensation = handover && (
    handover.owner_decision || 
    handover.ownerDecision || 
    (handover.status && handover.status !== 'none' && handover.status !== 'requested') || // 'requested' is often a placeholder
    (Number(handover.proposed_deduction || handover.proposedDeduction || handover.requestedAmount || 0) > 0)
  );

  if (hasCompensation && rental.status !== 'completed') return 'disputes';
  if (rental.status === 'completed') return 'completed';

  const ownerDelivery = reports.some((report) => report.phase === 'delivery' && (report.submitted_by_role ?? report.submittedByRole) === 'owner');
  const tenantDelivery = reports.some((report) => report.phase === 'delivery' && (report.submitted_by_role ?? report.submittedByRole) === 'tenant');
  const tenantReturn = reports.some((report) => report.phase === 'return' && (report.submitted_by_role ?? report.submittedByRole) === 'tenant');
  const ownerReturn = reports.some((report) => report.phase === 'return' && (report.submitted_by_role ?? report.submittedByRole) === 'owner');

  if (rental.status === 'confirmed') return 'awaiting_payment';
  
  if (rental.status === 'paid' && !ownerDelivery) return 'delivery';
  if (rental.status === 'paid' && ownerDelivery && !tenantDelivery) return 'handover';
  if (rental.status === 'in_use' && !tenantReturn) return 'in_use';
  if (rental.status === 'in_use' && tenantReturn && !ownerReturn) return 'return';

  return rental.status;
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

  useEffect(() => {
    if (routeRentalId) setSelectedRentalId(routeRentalId);
  }, [routeRentalId]);

  const rows = useMemo(() => {
    const normalizedRentals = normalizeDeliveryRows({ rentals, role, userId });
    return normalizedRentals.map((rental) => {
      const rentalReports = handoverReports.filter(h => (h.rental_op_id ?? h.rentalId) === rental.id);
      const rawComp = allCompensations.find(c => (c.rental_op_id ?? c.rentalId) === rental.id) || (rental.equipment_handover ?? rental.equipmentHandover);
      
      const comp = rawComp ? {
        ...rawComp,
        status: rawComp.owner_decision ?? rawComp.ownerDecision ?? rawComp.status,
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

  const reports = selectedRental ? handoverReports.filter(h => (h.rental_op_id ?? h.rentalId) === selectedRental.id) : [];
  const disputes = selectedRental ? allDisputes.filter(d => (d.rental_op_id ?? d.rentalId) === selectedRental.id) : [];
  
  const rawCompensation = selectedRental 
    ? (allCompensations.find(c => (c.rental_op_id ?? c.rentalId) === selectedRental.id) 
       || (selectedRental.equipment_handover ?? selectedRental.equipmentHandover)) 
    : undefined;

  const compensation = useMemo(() => {
    if (!rawCompensation || !selectedRental) return undefined;
    return {
      ...rawCompensation,
      id: rawCompensation.id,
      requestedAmount: rawCompensation.proposed_deduction ?? rawCompensation.proposedDeduction ?? rawCompensation.requestedAmount,
      status: rawCompensation.owner_decision ?? rawCompensation.ownerDecision ?? rawCompensation.status,
      notes: rawCompensation.final_notes ?? rawCompensation.finalNotes ?? rawCompensation.notes,
      rentalStatus: selectedRental.status,
      dispute: rawCompensation.dispute,
    };
  }, [rawCompensation, selectedRental]);
  
  const ownerReturnReport = reports.find((report) => report.phase === 'return' && (report.submitted_by_role ?? report.submittedByRole) === 'owner');
  const selectedStage = selectedRental?.workflowStage || 'delivery';
  const formSpec = getFormSpec({ role, stage: selectedStage });
  const activeForm = selectedRental ? { ...DEFAULT_FORM, ...(forms[selectedRental.id] || {}) } : DEFAULT_FORM;
  const activeCompensationForm = selectedRental
    ? { amount: '', notes: '', photos: [], ...(compensationForms[selectedRental.id] || {}) }
    : { amount: '', notes: '', photos: [] };
  const stageFeedback = getStageFeedback({ role, stage: selectedStage });

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
    if (!selectedRental || !formSpec) return;

    router.post('/handover-reports', {
      rental_op_id: selectedRental.id,
      phase: formSpec.phase,
      condition_status: activeForm.conditionStatus || 'good',
      has_issues: activeForm.hasDamage === 'true' || activeForm.conditionStatus === 'damaged',
      notes: activeForm.notes,
      images: activeForm.evidencePhotos,
    }, {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        setForms((current) => ({ ...current, [selectedRental.id]: DEFAULT_FORM }));
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

  const handleRequestCompensation = () => {
    if (!selectedRental || !ownerReturnReport || isSubmittingCompensation) return;
    const amount = Number(activeCompensationForm.amount || 0);
    if (!amount || !activeCompensationForm.notes.trim()) return;
    const handover = selectedRental.equipment_handover ?? selectedRental.equipmentHandover;
    if (!handover?.id) return;

    setIsSubmittingCompensation(true);
    const insuranceAmount = Number(selectedRental.insurance_amount ?? selectedRental.insuranceAmount ?? 0);
    router.post(`/equipment-handovers/${handover.id}/decide`, {
      owner_decision: (insuranceAmount > 0 && amount >= insuranceAmount)
        ? 'no_refund'
        : 'partial_refund',
      proposed_deduction: amount,
      final_condition: activeForm.conditionStatus,
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
      tenant_claim: claim || 'Tenant opened a compensation dispute.',
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
