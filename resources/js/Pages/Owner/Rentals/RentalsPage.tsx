import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import {
  AppInput,
  FilterTabs,
  PageHeader,
} from '../../../components/shared';
import RentalSelectionDetails from './components/RentalSelectionDetails';
import RentalsTable from './components/RentalsTable';
import { RENTAL_TABS } from './rentalHelpers';
import { useOwnerRentals } from './useOwnerRentals';

const Rentals = () => {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const handoverReports = props.handover_reports ?? [];
  const { rentals } = useOwnerPageProps();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(() => new URLSearchParams(window.location.search).get('selected'));

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const {
    selectedEquipment,
    selectedHandovers,
    selectedRental,
    selectedTenant,
    timeline,
    visibleRentals,
  } = useOwnerRentals({
    rentals,
    ownerId: user?.id,
    activeTab,
    search,
    selectedRentalId,
    getHandoversForRental: (rentalId) => handoverReports.filter(h => h.rental_id === rentalId),
  });

  const toggleRental = useCallback((rentalId) => {
    setSelectedRentalId((current) => (current === rentalId ? null : rentalId));
  }, []);

  return (
    <div>
      <PageHeader
        title="عمليات التأجير"
        actions={(
          <AppInput
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[220px]"
          />
        )}
      />

      <FilterTabs tabs={RENTAL_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <RentalsTable
        rentals={visibleRentals}
        isLoading={isLoading}
        selectedRentalId={selectedRentalId}
        onToggleRental={toggleRental}
      />

      <RentalSelectionDetails
        rental={selectedRental}
        equipment={selectedEquipment}
        tenant={selectedTenant}
        owner={user}
        handovers={selectedHandovers}
        timeline={timeline}
        onClose={() => setSelectedRentalId(null)}
      />
    </div>
  );
};

export default Rentals;

Rentals.layout = page => <OwnerLayout>{page}</OwnerLayout>;
