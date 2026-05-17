import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import {
  displayValue,
} from '../useEquipmentDraft';

const ReviewRow = ({ label, children }) => (
  <div className="review-row">
    <span className="text-muted">{label}:</span> {children}
  </div>
);

const ReviewStep = ({ draft, images }) => {
  const location = [draft.governorate, draft.address].filter(Boolean).join(' - ');

  return (
    <div>
      <h3 className="mb-6">المراجعة والنشر</h3>

      <div className="review-preview mb-8">
        <div className="owner-card equipment-card" style={{ maxWidth: 380 }}>
          <div style={{ height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={48} />
          </div>
          <div className="equipment-details">
            <div className="flex-between mb-2">
              <h3 className="equipment-title" style={{ margin: 0 }}>{displayValue(draft.name)}</h3>
              <span className="badge badge-available">متاح</span>
            </div>
            <div className="equipment-info-row">الموقع: {displayValue(location)}</div>
            <div className="equipment-info-row">السعر: {displayValue(draft.price_per_day)} ر.ي / اليوم</div>
            <div className="equipment-info-row">التأمين: {displayValue(draft.insurance_amount)} ر.ي</div>
          </div>
        </div>
      </div>

      <div className="owner-card mb-6" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <h4 className="mb-4">ملخص البيانات</h4>
        <ReviewRow label="الاسم">{displayValue(draft.name)}</ReviewRow>
        <ReviewRow label="الفئة">{displayValue(draft.category_id)}</ReviewRow>
        <ReviewRow label="الموقع">{displayValue(location)}</ReviewRow>
        <ReviewRow label="السعر اليومي">{displayValue(draft.price_per_day)} ر.ي</ReviewRow>
        <ReviewRow label="التأمين">{displayValue(draft.insurance_amount)} ر.ي</ReviewRow>
        <ReviewRow label="شروط التأجير">{displayValue(draft.rental_terms)}</ReviewRow>
        <ReviewRow label="الصور">{images.length || '—'}</ReviewRow>
      </div>
    </div>
  );
};

export default ReviewStep;
