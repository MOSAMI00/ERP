import { useState } from 'react';

export const EQUIPMENT_STEPS = ['المعلومات الأساسية', 'الصور', 'التسعير', 'المراجعة والنشر'];

export const categoryOptions = [
  'مولدات كهربائية',
  'معدات بناء',
  'معدات زراعية',
  'معدات تصوير',
  'إلكترونيات',
  'أخرى',
];

export const governorateOptions = [
  'صنعاء',
  'عدن',
  'تعز',
  'إب',
  'الحديدة',
  'ذمار',
  'حجة',
  'المكلا',
  'سيئون',
  'مأرب',
  'صعدة',
  'عمران',
  'البيضاء',
  'لحج',
  'أبين',
  'شبوة',
  'المهرة',
  'سقطرى',
  'الجوف',
  'الضالع',
  'ريمة',
];

export const conditionOptions = [
  { value: 'excellent', label: 'ممتاز' },
  { value: 'very_good', label: 'جيد جداً' },
  { value: 'good', label: 'جيد' },
  { value: 'fair', label: 'متوسط' },
];

export const deliveryOptions = [
  { value: 'pickup', label: 'المستأجر يأتي' },
  { value: 'delivery', label: 'أوصّل' },
  { value: 'both', label: 'كلاهما' },
];

export const minRentalOptions = ['يوم واحد', 'يومان', '3 أيام', 'أسبوع'];

const createSpec = () => ({ key: '', value: '' });

const initialDraft = {
  name: '',
  category: '',
  governorate: '',
  address: '',
  description: '',
  condition: 'excellent',
  deliveryMethod: 'both',
  dailyRate: '',
  weeklyRate: '',
  monthlyRate: '',
  insuranceAmount: '',
  minRental: minRentalOptions[0],
  maxRental: '',
  discount: '',
};

export const displayValue = (value) => value || '—';

export const getOptionLabel = (options, value) => (
  options.find((option) => option.value === value)?.label ?? value
);

export const useEquipmentDraft = () => {
  const [step, setStep] = useState(0);
  const [specs, setSpecs] = useState([createSpec()]);
  const [images] = useState([]);
  const [draft, setDraft] = useState(initialDraft);

  const addSpec = () => setSpecs((current) => [...current, createSpec()]);

  const removeSpec = (index) => {
    setSpecs((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateSpec = (index, key) => (event) => {
    setSpecs((current) => current.map((spec, currentIndex) => (
      currentIndex === index ? { ...spec, [key]: event.target.value } : spec
    )));
  };

  const updateDraft = (key) => (event) => {
    setDraft((current) => ({ ...current, [key]: event.target.value }));
  };

  const goNext = () => setStep((current) => Math.min(current + 1, EQUIPMENT_STEPS.length - 1));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  return {
    step,
    setStep,
    specs,
    images,
    draft,
    addSpec,
    removeSpec,
    updateSpec,
    updateDraft,
    goNext,
    goBack,
  };
};
