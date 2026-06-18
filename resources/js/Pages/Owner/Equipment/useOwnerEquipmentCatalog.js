import { useMemo } from 'react';

const getDisplayStatus = (latestRental) => {
  if (!latestRental) return 'available';
  if (latestRental.status === 'in_use') return 'in_use';
  if (['confirmed', 'paid'].includes(latestRental.status)) return 'confirmed';
  return 'available';
};

export const useOwnerEquipmentCatalog = ({
  ownerId,
  equipment = [],
  rentals = [],
  search = '',
  category = 'all',
  status = 'all',
}) => {
  const latestRentalByEquipmentId = useMemo(() => {
    const latestByEquipment = {};
    rentals.forEach((rental) => {
      const equipId = rental.equipment_id;
      const existing = latestByEquipment[equipId];
      if (!existing || new Date(rental.created_at).getTime() > new Date(existing.created_at).getTime()) {
        latestByEquipment[equipId] = rental;
      }
    });
    return latestByEquipment;
  }, [rentals]);

  const equipmentWithMeta = useMemo(() => equipment.map((item) => {
    const primaryImage = item.images?.find(img => img.is_primary) || item.images?.[0];
    const categoryName = item.category?.name_ar || item.category?.name || item.category;

    return {
      ...item,
      equipmentId: item.id,
      name: item.name,
      image: primaryImage?.image_url,
      location: item.governorate,
      dailyRate: parseFloat(item.price_per_day),
      insuranceAmount: parseFloat(item.insurance_amount ?? 0),
      rentalTerms: item.rental_terms,
      displayStatus: getDisplayStatus(latestRentalByEquipmentId[item.id]),
      rentalCount: rentals.filter((r) => r.equipment_id === item.id).length,
      category: categoryName,
    };
  }), [latestRentalByEquipmentId, equipment, rentals]);

  const categories = useMemo(
    () => Array.from(new Set(equipmentWithMeta.map((item) => item.category))).filter(Boolean),
    [equipmentWithMeta],
  );

  const filteredEquipment = useMemo(() => {
    const term = search.toLowerCase();
    return equipmentWithMeta
      .filter((item) => category === 'all' || item.category === category)
      .filter((item) => status === 'all' || item.status === status)
      .filter((item) => (item.name || '').toLowerCase().includes(term));
  }, [category, equipmentWithMeta, search, status]);

  return {
    categories,
    filteredEquipment,
    ownerEquipment: equipmentWithMeta,
  };
};
