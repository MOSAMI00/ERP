import React from 'react';
import { minRentalOptions } from '../useEquipmentDraft';

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
        <label className="owner-label">
          السعر الأسبوعي (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span>
        </label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 90000"
          value={draft.weeklyRate}
          onChange={updateDraft('weeklyRate')}
        />
      </div>

      <div className="mb-4">
        <label className="owner-label">
          السعر الشهري (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span>
        </label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 300000"
          value={draft.monthlyRate}
          onChange={updateDraft('monthlyRate')}
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

      <div className="mb-4">
        <label className="owner-label">الحد الأدنى للإيجار</label>
        <select className="owner-input" value={draft.minRental} onChange={updateDraft('minRental')}>
          {minRentalOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="owner-label">الحد الأقصى للإيجار (أيام)</label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 30"
          value={draft.maxRental}
          onChange={updateDraft('maxRental')}
        />
      </div>

      <div className="mb-4">
        <label className="owner-label">
          خصم % <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span>
        </label>
        <input
          type="number"
          className="owner-input"
          placeholder="مثال: 10"
          min="0"
          max="100"
          value={draft.discount}
          onChange={updateDraft('discount')}
        />
      </div>
    </div>
  </div>
);

export default PricingStep;
