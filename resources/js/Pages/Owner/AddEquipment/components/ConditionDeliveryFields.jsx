import React from 'react';
import { conditionOptions, deliveryOptions } from '../useEquipmentDraft';

const RadioGroup = ({ name, options, value, onChange }) => (
  <div className="radio-group">
    {options.map((option) => (
      <label key={option.value} className="radio-option">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
        />
        {option.label}
      </label>
    ))}
  </div>
);

const ConditionDeliveryFields = ({ draft, updateDraft }) => (
  <div className="owner-grid-2">
    <div className="mb-4">
      <label className="owner-label">حالة المعدة *</label>
      <RadioGroup
        name="condition"
        options={conditionOptions}
        value={draft.condition}
        onChange={updateDraft('condition')}
      />
    </div>

    <div className="mb-4">
      <label className="owner-label">وسيلة التسليم *</label>
      <RadioGroup
        name="delivery"
        options={deliveryOptions}
        value={draft.delivery_method}
        onChange={updateDraft('delivery_method')}
      />
    </div>
  </div>
);

export default ConditionDeliveryFields;
