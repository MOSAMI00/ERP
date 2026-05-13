import React from 'react';
import { governorateOptions } from '../useEquipmentDraft';

const LocationFields = ({ draft, updateDraft }) => (
  <div className="owner-grid-2">
    <div className="mb-4">
      <label className="owner-label">المحافظة *</label>
      <select className="owner-input" value={draft.governorate} onChange={updateDraft('governorate')}>
        <option value="">اختر المحافظة</option>
        {governorateOptions.map((governorate) => (
          <option key={governorate} value={governorate}>{governorate}</option>
        ))}
      </select>
    </div>

    <div className="mb-4">
      <label className="owner-label">العنوان التفصيلي *</label>
      <input
        type="text"
        className="owner-input"
        placeholder="مثال: صنعاء - شارع الستين - بجوار..."
        value={draft.address}
        onChange={updateDraft('address')}
      />
    </div>
  </div>
);

export default LocationFields;
