import { useMemo } from 'react';

const getDisplayStatus = (latestRental) => {
  if (latestRental?.status === 'confirmed') return 'confirmed';
  if (latestRental?.status === 'in_use') return 'in_use';
  if (latestRental?.status === 'cancelled') return 'hidden';
  return 'available';
};

export const useOwnerEquipmentCatalog = ({
  ownerId,
  rentals,
  search,
  category,
  status,
}) => {
  const ownerEquipment = useMemo(
    () => getOwnerEquipmentSnapshots(ownerId),
    [ownerId],
  );

  const latestRentalByEquipmentId = useMemo(() => {
    const latestByEquipment = {};
    rentals.forEach((rental) => {
      const existing = latestByEquipment[rental.equipmentId];
      if (!existing || new Date(rental.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        latestByEquipment[rental.equipmentId] = rental;
      }
    });
    return latestByEquipment;
  }, [rentals]);

  const equipmentWithMeta = useMemo(() => ownerEquipment.map((equipment) => ({
    ...equipment,
    displayStatus: getDisplayStatus(latestRentalByEquipmentId[equipment.equipmentId]),
    rentalCount: rentals.filter((item) => item.equipmentId === equipment.equipmentId).length,
  })), [latestRentalByEquipmentId, ownerEquipment, rentals]);

  const categories = useMemo(
    () => Array.from(new Set(ownerEquipment.map((equipment) => equipment.category))).filter(Boolean),
    [ownerEquipment],
  );

  const filteredEquipment = useMemo(() => {
    const term = search.toLowerCase();
    return equipmentWithMeta
      .filter((equipment) => category === 'all' || equipment.category === category)
      .filter((equipment) => status === 'all' || equipment.displayStatus === status)
      .filter((equipment) => equipment.name.toLowerCase().includes(term));
  }, [category, equipmentWithMeta, search, status]);

  return {
    categories,
    filteredEquipment,
    ownerEquipment,
  };
};
