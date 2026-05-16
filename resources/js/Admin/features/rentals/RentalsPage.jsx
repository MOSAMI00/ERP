import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import StatusTabs from './components/StatusTabs';
import RentalsFilterBar from './components/RentalsFilterBar';
import RentalsTable from './components/RentalsTable';
import RentalDrawer from './components/RentalDrawer';
import useDrawer from '../../hooks/useDrawer';
import { rentalsTabs } from '../../data/rentals';
import { asArray, normalizeRental } from '../../../utils/pageData';

export default function RentalsPage() {
  const { props } = usePage();
  const [activeTab, setActiveTab] = useState('all');
  const drawer = useDrawer();
  const rentals = asArray(props.rentals).map(normalizeRental);
  const filteredRentals = activeTab === 'all'
    ? rentals
    : rentals.filter((rental) => rental.status === activeTab);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <StatusTabs tabs={rentalsTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <RentalsFilterBar />
      <RentalsTable rentals={filteredRentals} onOpenDrawer={drawer.open} />
      <RentalDrawer isOpen={drawer.isOpen} rental={drawer.selectedItem} onClose={drawer.close} />
    </div>
  );
}
