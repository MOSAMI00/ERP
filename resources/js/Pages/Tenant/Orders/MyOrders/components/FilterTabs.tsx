
import { FilterTabs } from '../../../../../Components/shared/FilterTabs';
import { RENTAL_TABS } from '../../../../../entities/rental';

export function OrderTabs({ activeTab, onTabChange, rentals }) {
  const tabs = RENTAL_TABS.map((tab) => ({
    id: tab.key,
    label: tab.label,
    count: tab.key === 'all' ? rentals.length : rentals.filter((r) => r.status === tab.key).length,
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
