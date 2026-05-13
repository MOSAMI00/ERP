import React from 'react';
import { Plus, X } from 'lucide-react';

const SpecsEditor = ({ specs, addSpec, removeSpec, updateSpec }) => (
  <div className="mb-6">
    <label className="owner-label">المواصفات التقنية</label>
    {specs.map((spec, index) => (
      <div key={index} className="flex-center gap-4 mb-2" style={{ justifyContent: 'flex-start' }}>
        <input
          type="text"
          className="owner-input"
          placeholder="المواصفة (مثال: القدرة)"
          style={{ flex: 1 }}
          value={spec.key}
          onChange={updateSpec(index, 'key')}
        />
        <input
          type="text"
          className="owner-input"
          placeholder="القيمة (مثال: 10KVA)"
          style={{ flex: 1 }}
          value={spec.value}
          onChange={updateSpec(index, 'value')}
        />
        {specs.length > 1 ? (
          <button
            className="owner-btn owner-btn-outline"
            onClick={() => removeSpec(index)}
            style={{ padding: '8px', color: 'var(--color-disputed)' }}
            type="button"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>
    ))}
    <button className="owner-btn owner-btn-outline mt-2" onClick={addSpec} type="button">
      <Plus size={16} /> إضافة مواصفة
    </button>
  </div>
);

export default SpecsEditor;
