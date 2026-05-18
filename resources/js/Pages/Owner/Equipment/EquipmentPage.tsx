import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useState } from 'react';
import { visit } from '../../../inertia/navigation';
import EquipmentGrid from './components/EquipmentGrid';
import EquipmentToolbar from './components/EquipmentToolbar';
import { useOwnerEquipmentCatalog } from './useOwnerEquipmentCatalog';
import { useSharedData } from '@/inertia/useSharedData';

interface MyEquipmentProps {
  equipment?: any[];
  rentals?: any[];
}

const MyEquipment = ({ equipment = [], rentals = [] }: MyEquipmentProps) => {
  const { auth, statuses } = useSharedData();
  const user = auth?.user ?? null;
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const { categories, filteredEquipment } = useOwnerEquipmentCatalog({
    ownerId: user?.id,
    equipment,
    rentals,
    search,
    category,
    status,
  });

  const handleAddEquipment = () => visit('/owner/equipment/add');

  return (
    <div>
      <EquipmentToolbar
        search={search}
        category={category}
        status={status}
        categories={categories}
        equipmentStatuses={statuses.equipment}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onStatusChange={setStatus}
        onAddEquipment={handleAddEquipment}
      />

      <EquipmentGrid
        isLoading={isLoading}
        equipment={filteredEquipment}
        onAddEquipment={handleAddEquipment}
      />
    </div>
  );
};

export default MyEquipment;

MyEquipment.layout = page => <OwnerLayout>{page}</OwnerLayout>;
