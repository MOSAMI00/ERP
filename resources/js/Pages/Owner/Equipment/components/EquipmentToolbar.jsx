import React from 'react';
import { Plus, Search } from 'lucide-react';
import { AppButton, AppInput, AppSelect, PageHeader } from '../../../../components/shared';

const statusOptions = [
  { value: 'all', label: 'الحالة' },
  { value: 'available', label: 'متاح' },
  { value: 'confirmed', label: 'محجوز' },
  { value: 'in_use', label: 'قيد الاستخدام' },
  { value: 'hidden', label: 'مخفي' },
];

const EquipmentToolbar = ({
  search,
  category,
  status,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onAddEquipment,
}) => (
  <PageHeader
    title="معداتي"
    actions={(
      <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
          <AppInput
            type="text"
            placeholder="بحث..."
            style={{ paddingRight: 36, width: 180 }}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <AppSelect style={{ width: 130 }} value={category} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="all">الفئة</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </AppSelect>
        <AppSelect style={{ width: 130 }} value={status} onChange={(event) => onStatusChange(event.target.value)}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </AppSelect>
        <AppButton onClick={onAddEquipment}>
          <Plus size={18} /> إضافة معدة جديدة
        </AppButton>
      </div>
    )}
  />
);

export default EquipmentToolbar;
