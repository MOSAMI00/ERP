import React from 'react';
import { usePage } from '@inertiajs/react';
import { categoryOptions } from '../useEquipmentDraft';

const BasicDetailsFields = ({ draft, updateDraft }) => {
  const { props } = usePage();
  const categories = props.categories ?? [];

  return (
    <>
      <div className="owner-grid-2">
        <div className="mb-4">
          <label className="owner-label">اسم المعدة *</label>
          <input
            type="text"
            className="owner-input"
            placeholder="مثال: مولد كهرباء 10KVA"
            value={draft.name}
            onChange={updateDraft('name')}
          />
        </div>

        <div className="mb-4">
          <label className="owner-label">الفئة *</label>
          <select className="owner-input" value={draft.category_id} onChange={updateDraft('category_id')}>
            <option value="">اختر الفئة</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_ar}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="owner-label">الوصف *</label>
        <textarea
          className="owner-input"
          rows={4}
          placeholder="وصف تفصيلي للمعدة ومميزاتها..."
          value={draft.description}
          onChange={updateDraft('description')}
        />
      </div>

      <div className="mb-4">
        <label className="owner-label">شروط التأجير *</label>
        <textarea
          className="owner-input"
          rows={4}
          placeholder="مثال: الاستخدام داخل المدينة فقط، يتحمل المستأجر تكلفة النقل، إعادة المعدة بنفس حالة الاستلام..."
          value={draft.rental_terms}
          onChange={updateDraft('rental_terms')}
        />
      </div>
    </>
  );
};

export default BasicDetailsFields;
