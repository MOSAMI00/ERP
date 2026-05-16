import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import SummaryCards from './components/SummaryCards';
import DisputesTable from './components/DisputesTable';
import DisputeReviewPage from './components/DisputeReviewPage';
import { asArray, normalizeDispute, paginator } from '../../../utils/pageData';

export default function DisputesPage() {
  const { props } = usePage();
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [decision, setDecision] = useState('accept');
  const [adjustedAmount, setAdjustedAmount] = useState('');
  const disputes = asArray(props.disputes).map((dispute) => {
    const normalized = normalizeDispute(dispute);
    return {
      ...normalized,
      tenant: normalized.rental?.tenant?.name ?? '—',
      owner: normalized.rental?.owner?.name ?? '—',
      eq: normalized.rental?.equipment?.name ?? '—',
      amount: normalized.displayAmount,
      ownerAmount: normalized.ownerRequestedAmount,
      tenantAmount: normalized.tenantProposedAmount,
      finalAmount: normalized.finalCompensation,
      date: String(normalized.created_at ?? normalized.createdAt ?? '').slice(0, 10),
      statusColor: normalized.status === 'resolved' ? 'success' : normalized.status === 'under_review' ? 'warning' : 'danger',
    };
  });

  const openReview = (dispute) => {
    setSelectedDispute(dispute);
    setDecision('accept');
    setAdjustedAmount(String(dispute.finalCompensation || dispute.ownerRequestedAmount || dispute.amount || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeReview = () => {
    setSelectedDispute(null);
  };

  if (selectedDispute) {
    return (
      <DisputeReviewPage
        dispute={selectedDispute}
        decision={decision}
        setDecision={setDecision}
        adjustedAmount={adjustedAmount}
        setAdjustedAmount={setAdjustedAmount}
        onCloseReview={closeReview}
        onResolve={(adminNote) => {
          const decisionMap = {
            accept: 'accept_deduction',
            reject: 'reject_deduction',
            adjust: 'modify_compensation',
          };

          router.post(route('admin.disputes.resolve', selectedDispute.id), {
            admin_decision: decisionMap[decision],
            final_compensation: decision === 'adjust' ? adjustedAmount : undefined,
            admin_note: adminNote,
          }, {
            preserveScroll: true,
            onSuccess: closeReview,
          });
        }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SummaryCards summary={props.summary} />
      <DisputesTable
        disputes={disputes}
        pagination={paginator(props.disputes)}
        filters={props.filters ?? {}}
        onOpenReview={openReview}
      />
    </div>
  );
}
