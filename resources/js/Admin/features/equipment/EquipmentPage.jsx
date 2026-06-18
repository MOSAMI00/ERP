import { useState } from 'react';
import { router } from '@inertiajs/react';
import EquipmentFilterBar from './components/EquipmentFilterBar';
import EquipmentGrid from './components/EquipmentGrid';
import EquipmentList from './components/EquipmentList';
import EquipmentDrawer from './components/EquipmentDrawer';
import useDrawer from '../../hooks/useDrawer';
import { asArray, normalizeEquipment } from '../../../utils/pageData';

export default function EquipmentPage({ equipment: rawEquipment, filters }) {
  const [viewMode, setViewMode] = useState('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const drawer = useDrawer();
  const equipment = asArray(rawEquipment).map(normalizeEquipment);

  const openDrawer = (equipment) => {
    setCurrentImageIndex(0);
    drawer.open(equipment);
  };

  const toggleVisibility = (item) => {
    router.post(route('admin.equipment.toggle-visibility', item.id), {}, {
      preserveScroll: true,
    });
  };

  const deleteEquipment = (item) => {
    if (!confirm(`هل أنت متأكد من حذف "${item.name}"؟`)) return;

    router.delete(route('admin.equipment.destroy', item.id), {
      preserveScroll: true,
      onSuccess: drawer.close,
    });
  };

  const nextImage = () => {
    if (drawer.selectedItem) {
      setCurrentImageIndex((prev) => (prev + 1) % drawer.selectedItem.images.length);
    }
  };

  const prevImage = () => {
    if (drawer.selectedItem) {
      setCurrentImageIndex((prev) => (prev - 1 + drawer.selectedItem.images.length) % drawer.selectedItem.images.length);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative min-w-0">
      <EquipmentFilterBar viewMode={viewMode} setViewMode={setViewMode} filters={filters} />
      {viewMode === 'grid' ? (
        <EquipmentGrid equipment={equipment} onOpenDrawer={openDrawer} onToggleVisibility={toggleVisibility} onDelete={deleteEquipment} />
      ) : (
        <EquipmentList equipment={equipment} onOpenDrawer={openDrawer} onToggleVisibility={toggleVisibility} onDelete={deleteEquipment} />
      )}
      <EquipmentDrawer
        isOpen={drawer.isOpen}
        equipment={drawer.selectedItem}
        currentImageIndex={currentImageIndex}
        onClose={drawer.close}
        nextImage={nextImage}
        prevImage={prevImage}
        onToggleVisibility={toggleVisibility}
        onDelete={deleteEquipment}
      />
    </div>
  );
}
