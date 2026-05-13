import React from 'react';
import { Image as ImageIcon, Plus } from 'lucide-react';

const photoSlots = Array.from({ length: 5 }, (_, index) => index);

const PhotosStep = () => (
  <div>
    <h3 className="mb-2">صور المعدة</h3>
    <p className="text-muted mb-6">ارفع 5 صور على الأقل لعرض المعدة بشكل واضح</p>

    <div className="image-upload-grid mb-6">
      {photoSlots.map((slot) => (
        <div key={slot} className="image-upload-slot">
          {slot === 0 ? (
            <div className="image-upload-placeholder">
              <ImageIcon size={32} />
              <span>الصورة الرئيسية</span>
            </div>
          ) : (
            <div className="image-upload-placeholder">
              <Plus size={24} />
              <span>صورة {slot + 1}</span>
            </div>
          )}
        </div>
      ))}
      <div className="image-upload-slot" style={{ border: '2px dashed var(--color-primary-green)' }}>
        <div className="image-upload-placeholder" style={{ color: 'var(--color-primary-green)' }}>
          <Plus size={32} />
          <span>إضافة المزيد</span>
        </div>
      </div>
    </div>

    <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
      <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
        نصائح للصور: التقط صوراً واضحة من زوايا مختلفة، أظهر أي عيوب موجودة، استخدم إضاءة جيدة، الحد الأدنى 5 صور
      </p>
    </div>
  </div>
);

export default PhotosStep;
