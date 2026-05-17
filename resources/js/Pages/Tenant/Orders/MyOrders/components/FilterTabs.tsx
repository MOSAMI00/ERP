
import { FilterTabs } from '../../../../../Components/shared/FilterTabs';
import type { SharedStatus } from '@/types/inertia';

interface OrderTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  rentals: Array<{ status?: string }>;
  rentalStatuses: SharedStatus[];
}

export function OrderTabs({ activeTab, onTabChange, rentals, rentalStatuses }: OrderTabsProps) {
  const tabs = [
    { id: 'all', label: 'الكل' },
    ...rentalStatuses.map((status) => ({ id: status.value, label: status.label })),
  ].map((tab) => ({
    ...tab,
    count: tab.id === 'all' ? rentals.length : rentals.filter((r) => r.status === tab.id).length,
  }));

  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId || 'all')}
      className="mb-5"
    />
  );
}
