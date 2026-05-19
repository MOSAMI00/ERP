import { useState } from 'react';

import StatusTabs from './components/StatusTabs';
import RentalsFilterBar from './components/RentalsFilterBar';
import RentalsTable from './components/RentalsTable';
import RentalDrawer from './components/RentalDrawer';
import useDrawer from '../../hooks/useDrawer';
import { rentalsTabs } from '../../data/rentals';
import { asArray, normalizeRental } from '../../../utils/pageData';

export default function RentalsPage({ rentals: rawRentals, filters }) {
  const [activeTab, setActiveTab] = useState('all');
  const drawer = useDrawer();
  const rentals = asArray(rawRentals).map(normalizeRental);
  const tabs = rentalsTabs.map((tab) => ({
    ...tab,
    count: tab.id === 'all' ? rentals.length : rentals.filter((rental) => rental.status === tab.id).length,
  }));
  const filteredRentals = activeTab === 'all'
    ? rentals
    : rentals.filter((rental) => rental.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <StatusTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <RentalsFilterBar filters={filters} />
      <RentalsTable rentals={filteredRentals} onOpenDrawer={drawer.open} />
      <RentalDrawer isOpen={drawer.isOpen} rental={drawer.selectedItem} onClose={drawer.close} />
    </div>
  );
}
