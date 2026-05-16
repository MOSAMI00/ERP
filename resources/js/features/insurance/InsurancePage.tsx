import React, { useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
  AppInput,
  EmptyState,
  FilterTabs,
  PageHeader,
} from '../../components/shared';
import { getInsuranceConfig } from './lib/insuranceConfig';
import { TenantInsuranceTable } from './ui/TenantInsuranceTable';
import { OwnerInsuranceTable } from './ui/OwnerInsuranceTable';

const STATUS_LABELS = {
  pending: 'قيد المراجعة',
  confirmed: 'بانتظار الدفع',
  paid: 'مدفوع ومحتجز',
  in_use: 'قيد الاستخدام',
  return_done: 'تم الإرجاع',
  compensation_requested: 'مطالبة خصم',
  disputed: 'نزاع',
  completed: 'مكتمل',
  cancelled: 'ملغي',
};

function enumValue(value, fallback = '') {
  if (!value) return fallback;
  if (typeof value === 'object') return value.value ?? value.name ?? fallback;
  return value;
}

function moneyNumber(value) {
  return Number(value ?? 0);
}

function personName(user, fallback) {
  return user?.full_name ?? user?.name ?? fallback;
}

function orderNum(rental) {
  return rental.orderNum ?? rental.order_num ?? `#${String(rental.id).padStart(5, '0')}`;
}

function normalizeInsuranceRows({ rentals, policies, role }) {
  const source = policies?.length ? policies : rentals;

  return source.map((item) => {
    if (policies?.length) return item;

    const status = enumValue(item.status);
    const handover = item.equipment_handover ?? item.equipmentHandover ?? {};
    const dispute = handover.dispute ?? item.dispute ?? null;
    const disputeStatus = enumValue(dispute?.status);
    const insuranceAmount = moneyNumber(item.insurance_amount ?? item.insuranceAmount);
    const ownerRequestedAmount = moneyNumber(handover.proposed_deduction ?? handover.proposedDeduction);
    const tenantProposedAmount = moneyNumber(dispute?.requested_amount ?? dispute?.requestedAmount);
    const finalDeduction = disputeStatus === 'resolved'
      ? moneyNumber(dispute?.final_compensation ?? dispute?.finalCompensation)
      : status === 'completed'
        ? ownerRequestedAmount
        : 0;
    const refundAmount = Math.max(insuranceAmount - finalDeduction, 0);

    let insuranceStatus = 'not_started';
    if (status === 'disputed' || (dispute && disputeStatus !== 'resolved')) insuranceStatus = 'disputed';
    else if (['paid', 'in_use', 'return_done', 'compensation_requested'].includes(status)) insuranceStatus = 'held';
    else if (status === 'completed' && finalDeduction > 0) insuranceStatus = 'released';
    else if (status === 'completed') insuranceStatus = 'refunded';

    const partner = role === 'owner' ? item.tenant : item.owner;

    return {
      id: item.id,
      orderNum: orderNum(item),
      partnerName: personName(partner, role === 'owner' ? 'المستأجر' : 'المؤجر'),
      equipment: item.equipment?.name ?? 'معدة',
      rentalStatus: status,
      rentalStatusLabel: STATUS_LABELS[status] ?? status,
      status: insuranceStatus,
      amount: insuranceAmount,
      ownerRequestedAmount,
      tenantProposedAmount,
      finalDeduction,
      refundAmount,
      heldAmount: ['held', 'disputed'].includes(insuranceStatus) ? insuranceAmount : 0,
      deductionReason: handover.final_notes ?? handover.finalNotes ?? dispute?.tenant_claim ?? dispute?.tenantClaim ?? '',
      adminNote: dispute?.admin_note ?? dispute?.adminNote ?? '',
      disputeStatus,
      startDate: item.start_date ?? item.startDate,
      endDate: item.end_date ?? item.endDate,
    };
  });
}

export default function InsurancePage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || 'tenant';
  const config = getInsuranceConfig(role);
  const rows = normalizeInsuranceRows({
    rentals: props.rentals ?? [],
    policies: props.insurance_policies ?? [],
    role,
  });
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((row) => activeTab === 'all' || row.status === activeTab)
      .filter((row) => (
        term.length === 0 ||
        (row.order_num ?? row.orderNum ?? '').toLowerCase().includes(term) ||
        (row.partner_name ?? row.partnerName ?? '').toLowerCase().includes(term) ||
        (row.equipment ?? '').toLowerCase().includes(term) ||
        (row.rentalStatusLabel ?? '').toLowerCase().includes(term)
      ));
  }, [activeTab, rows, search]);

  const tabs = config.tabs.map((tab) => ({
    ...tab,
    count: tab.id === 'all' ? rows.length : rows.filter((row) => row.status === tab.id).length,
  }));

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={config.description}
        actions={(
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث بالطلب أو الطرف أو المعدة..."
            className="w-full md:w-80"
          />
        )}
      />

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredRows.length > 0 ? (
        role === 'tenant' ? (
          <TenantInsuranceTable rows={filteredRows} />
        ) : (
          <OwnerInsuranceTable rows={filteredRows} />
        )
      ) : (
        <EmptyState
          icon="🛡️"
          title={config.emptyTitle}
          description={config.emptyDescription}
        />
      )}
    </div>
  );
}
