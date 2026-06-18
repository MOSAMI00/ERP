import { useMemo } from 'react';
import { equipmentOf, tenantOf } from './requestHelpers';

export const useOwnerRequests = ({
  rentals,
  ownerId,
  activeTab,
  search,
  selectedRentalId,
  rentalStatuses = [],
}) => {
  const ownerRentalPool = useMemo(
    () => rentals.filter((rental) => (rental.owner_id ?? rental.ownerId) === ownerId),
    [rentals, ownerId],
  );

  const visibleRentals = useMemo(() => {
    const term = search.toLowerCase();
    return ownerRentalPool
      .filter((rental) => activeTab === 'all' || rental.status === activeTab)
      .filter((rental) => {
        const equipment = equipmentOf(rental);
        const tenant = tenantOf(rental);
        return (
          (equipment.name ?? '').toLowerCase().includes(term) ||
            (rental.order_num ?? rental.orderNum ?? '').toLowerCase().includes(term) ||
          (tenant.name ?? '').toLowerCase().includes(term)
        );
      });
  }, [activeTab, ownerRentalPool, search]);

  const selectedRental = useMemo(() => (
    ownerRentalPool.find((rental) => rental.id === selectedRentalId)
    ?? rentals.find((rental) => rental.id === selectedRentalId)
  ), [ownerRentalPool, rentals, selectedRentalId]);

  const tabs = useMemo(() => [
    { id: 'all', label: 'الكل' },
    ...rentalStatuses.map((status) => ({ id: status.value, label: status.label })),
  ].map((tab) => ({
    ...tab,
    count: tab.id === 'all'
      ? ownerRentalPool.length
      : ownerRentalPool.filter((rental) => rental.status === tab.id).length,
  })), [ownerRentalPool, rentalStatuses]);

  return {
    ownerRentalPool,
    selectedRental,
    tabs,
    visibleRentals,
  };
};
