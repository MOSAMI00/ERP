import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { visit } from '../../../inertia/navigation';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EquipmentGrid from './components/EquipmentGrid';
import EquipmentToolbar from './components/EquipmentToolbar';
import { useOwnerEquipmentCatalog } from './useOwnerEquipmentCatalog';

const MyEquipment = () => {
  const { props } = usePage() as any;
  const user = props.auth?.user ?? null;
  const { rentals, equipment } = useOwnerPageProps();
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
