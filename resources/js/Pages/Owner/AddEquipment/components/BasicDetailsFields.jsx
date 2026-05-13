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
          <label className="owner-label">Ø§Ø³Ù… Ø§Ù„Ù…Ø¹Ø¯Ø© *</label>
          <input
            type="text"
            className="owner-input"
            placeholder="Ù…Ø«Ø§Ù„: Ù…ÙˆÙ„Ø¯ ÙƒÙ‡Ø±Ø¨Ø§Ø¡ 10KVA"
            value={draft.name}
            onChange={updateDraft('name')}
          />
        </div>

        <div className="mb-4">
          <label className="owner-label">Ø§Ù„ÙØ¦Ø© *</label>
          <select className="owner-input" value={draft.category_id} onChange={updateDraft('category_id')}>
            <option value="">Ø§Ø®ØªØ± Ø§Ù„ÙØ¦Ø©</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_ar}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="owner-label">Ø§Ù„ÙˆØµÙ *</label>
        <textarea
          className="owner-input"
          rows={4}
          placeholder="ÙˆØµÙ ØªÙØµÙŠÙ„ÙŠ Ù„Ù„Ù…Ø¹Ø¯Ø© ÙˆÙ…Ù…ÙŠØ²Ø§ØªÙ‡Ø§..."
          value={draft.description}
          onChange={updateDraft('description')}
        />
      </div>
    </>
  );
};

export default BasicDetailsFields;
