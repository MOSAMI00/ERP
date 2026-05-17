import { useMemo } from 'react';
import { buildRentalTimeline, fallbackEquipment, fallbackTenant } from './rentalHelpers';

export const useOwnerRentals = ({
  rentals,
  ownerId,
  activeTab,
  search,
  selectedRentalId,
  getHandoversForRental,
}) => {
  const visibleRentals = useMemo(() => (
    rentals
      .filter((rental) => (rental.owner_id ?? rental.ownerId) === ownerId)
      .filter((rental) => activeTab === 'all' || rental.status === activeTab)
      .filter((rental) => {
        const equipment = fallbackEquipment(rental);
        const tenant = fallbackTenant(rental);
        const term = search.toLowerCase();
        return (
          (equipment.name ?? '').toLowerCase().includes(term) ||
          (rental.order_num ?? rental.orderNum ?? '').toLowerCase().includes(term) ||
          (tenant.name ?? tenant.full_name ?? '').toLowerCase().includes(term)
        );
      })
  ), [activeTab, ownerId, rentals, search]);

  const selectedRental = useMemo(
    () => rentals.find((rental) => rental.id === selectedRentalId),
    [rentals, selectedRentalId],
  );

  const selectedEquipment = selectedRental ? fallbackEquipment(selectedRental) : null;
  const selectedTenant = selectedRental ? fallbackTenant(selectedRental) : null;
  const selectedHandovers = selectedRental ? getHandoversForRental(selectedRental.id) : [];
  const timeline = buildRentalTimeline(selectedRental);

  return {
    selectedEquipment,
    selectedHandovers,
    selectedRental,
    selectedTenant,
    timeline,
    visibleRentals,
  };
};
