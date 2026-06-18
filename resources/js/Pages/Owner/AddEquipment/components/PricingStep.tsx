import React from 'react';
const PricingStep = ({ draft, updateDraft }) => (
  <div>
    <h3 className="mb-6">التسعير</h3>

    <div className="owner-grid-2">
      <div className="mb-4">
        <label className="owner-label">السعر اليومي * (ر.ي)</label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 15000"
          value={draft.price_per_day}
          onChange={updateDraft('price_per_day')}
        />
      </div>

      <div className="mb-4">
        <label className="owner-label">مبلغ التأمين * (ر.ي)</label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 50000"
          value={draft.insurance_amount}
          onChange={updateDraft('insurance_amount')}
        />
        <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
          يُحتجز من المستأجر عبر Escrow ويُرد بعد التسليم السليم
        </span>
      </div>
    </div>
  </div>
);

export default PricingStep;
