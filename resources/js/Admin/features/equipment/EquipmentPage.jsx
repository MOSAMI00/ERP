import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import EquipmentFilterBar from './components/EquipmentFilterBar';
import EquipmentGrid from './components/EquipmentGrid';
import EquipmentList from './components/EquipmentList';
import EquipmentDrawer from './components/EquipmentDrawer';
import useDrawer from '../../hooks/useDrawer';
import { asArray, normalizeEquipment } from '../../../utils/pageData';

export default function EquipmentPage() {
  const { props } = usePage();
  const [viewMode, setViewMode] = useState('grid');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const drawer = useDrawer();
  const equipment = asArray(props.equipment).map(normalizeEquipment);

  const openDrawer = (equipment) => {
    setCurrentImageIndex(0);
    drawer.open(equipment);
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
      <EquipmentFilterBar viewMode={viewMode} setViewMode={setViewMode} />
      {viewMode === 'grid' ? (
        <EquipmentGrid equipment={equipment} onOpenDrawer={openDrawer} />
      ) : (
        <EquipmentList equipment={equipment} onOpenDrawer={openDrawer} />
      )}
      <EquipmentDrawer
        isOpen={drawer.isOpen}
        equipment={drawer.selectedItem}
        currentImageIndex={currentImageIndex}
        onClose={drawer.close}
        nextImage={nextImage}
        prevImage={prevImage}
      />
    </div>
  );
}
