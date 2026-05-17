import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import { visit } from '../../../inertia/navigation';
import BasicInfoStep from './components/BasicInfoStep';
import PhotosStep from './components/PhotosStep';
import PricingStep from './components/PricingStep';
import ReviewStep from './components/ReviewStep';
import { EQUIPMENT_STEPS } from './useEquipmentDraft';
import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { useState } from 'react';

export default function AddEquipmentPage() {
  const [step, setStep] = useState(0);
  const { props } = usePage() as any;
  const equipment = props.equipment ?? null;
  const isEditMode = (props.mode ?? '') === 'edit' && Boolean(equipment?.id);

  const form = useForm({
    name: equipment?.name ?? '',
    category_id: equipment?.category_id ? String(equipment.category_id) : '',
    governorate: equipment?.governorate ?? '',
    address: equipment?.address ?? '',
    description: equipment?.description ?? '',
    price_per_day: equipment?.price_per_day ?? '',
    insurance_amount: equipment?.insurance_amount ?? '',
    rental_terms: equipment?.rental_terms ?? '',
    images: (equipment?.images ?? []) as any[],
  });

  const updateDraft = (key: string) => (event: any) => {
    form.setData(key as any, event.target.value);
  };

  const goNext = () => setStep((s) => Math.min(s + 1, EQUIPMENT_STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    form.transform((data) => ({
      ...data,
      images: data.images.filter((image) => image instanceof File),
    }));

    const options = {
      onSuccess: () => visit('/owner/equipment'),
      forceFormData: true,
    };

    if (isEditMode) {
      form.post(`/equipment/${equipment.id}?_method=PATCH`, options);
      return;
    }

    form.post('/equipment', options);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep
            draft={form.data}
            updateDraft={updateDraft}
          />
        );
      case 1:
        return (
          <PhotosStep 
            images={form.data.images} 
            setImages={(imgs) => form.setData('images', imgs)} 
          />
        );
      case 2:
        return <PricingStep draft={form.data} updateDraft={updateDraft} />;
      case 3:
        return <ReviewStep draft={form.data} images={form.data.images} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>{isEditMode ? 'تعديل المعدة' : 'إضافة معدة جديدة'}</h2>
        <button className="owner-btn owner-btn-outline" onClick={() => visit('/owner/equipment')}>
          <X size={16} /> إلغاء
        </button>
      </div>

      {/* Stepper */}
      <div className="stepper mb-8">
        {EQUIPMENT_STEPS.map((label, i) => (
          <div key={i} className={`stepper-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="stepper-label">{label}</span>
            {i < EQUIPMENT_STEPS.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <div className="owner-card">
        {renderStep()}

        {form.errors && Object.keys(form.errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {Object.values(form.errors).map((error, i) => (
              <p key={i}>{error as string}</p>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-between mt-8" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
          <button
            className="owner-btn owner-btn-outline"
            onClick={() => (step === 0 ? visit('/owner/equipment') : goBack())}
          >
            {step === 0 ? <X size={16} /> : <ArrowRight size={16} />} 
            {step === 0 ? 'إلغاء' : 'السابق'}
          </button>

          {step < EQUIPMENT_STEPS.length - 1 ? (
            <button className="owner-btn owner-btn-primary" onClick={goNext}>
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button
              className="owner-btn owner-btn-primary"
              onClick={handleSubmit}
              disabled={form.processing}
            >
              <Check size={16} /> {form.processing ? 'جاري الحفظ...' : (isEditMode ? 'حفظ التعديلات' : 'نشر المعدة')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

AddEquipmentPage.layout = (page: React.ReactNode) => <OwnerLayout>{page}</OwnerLayout>;
