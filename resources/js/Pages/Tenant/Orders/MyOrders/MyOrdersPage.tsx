import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { OrderHeader } from './components/OrderHeader';
import { OrderActionBanner } from './components/ActionBanner';
import { OrderTabs } from './components/FilterTabs';
import { OrdersGrid } from './components/OrdersGrid';
import { TenantLayout } from '../../../../Layouts/tenant/TenantLayout';

export default function MyOrdersPage() {
  const { props } = usePage();
  const rentals = props.rentals ?? [];
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActions = rentals.some((r) => r.status === 'confirmed' || r.status === 'pending');
  const filtered = rentals.filter((r) => {
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const equipmentName = r.equipment?.name ?? '';
    const ownerName = r.equipment?.owner_name ?? r.equipment?.ownerName ?? '';
    const matchSearch =
      equipmentName.includes(searchQuery) ||
      (r.order_num ?? r.orderNum ?? '').includes(searchQuery) ||
      ownerName.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <OrderHeader
        count={rentals.length}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {hasActions && <OrderActionBanner rentals={rentals} />}
      <OrderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rentals={rentals}
      />
      <OrdersGrid filtered={filtered} />
    </div>
  );
}

MyOrdersPage.layout = (page) => <TenantLayout>{page}</TenantLayout>;
