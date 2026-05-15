import { useState } from 'react';
import StatusTabs from './components/StatusTabs';
import RentalsFilterBar from './components/RentalsFilterBar';
import RentalsTable from './components/RentalsTable';
import RentalDrawer from './components/RentalDrawer';
import useDrawer from '../../hooks/useDrawer';
import { rentalsTabs, rentalsData } from '../../data/rentals';

export default function RentalsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const drawer = useDrawer();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <StatusTabs tabs={rentalsTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      <RentalsFilterBar />
      <RentalsTable rentals={rentalsData} onOpenDrawer={drawer.open} />
      <RentalDrawer isOpen={drawer.isOpen} rental={drawer.selectedItem} onClose={drawer.close} />
    </div>
  );
}
