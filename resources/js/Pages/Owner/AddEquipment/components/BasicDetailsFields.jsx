import React from 'react';

const BasicDetailsFields = ({ draft, updateDraft, categories = [] }) => (
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

    </>
);

export default BasicDetailsFields;
