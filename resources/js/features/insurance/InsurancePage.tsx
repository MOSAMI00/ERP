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

export default function InsurancePage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || 'tenant';
  const config = getInsuranceConfig(role);
  const rows = props.insurance_policies ?? [];
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
        (row.equipment ?? '').toLowerCase().includes(term)
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
