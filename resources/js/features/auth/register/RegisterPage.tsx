import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FormSection } from './FormSection/FormSection';
import { InfoSection } from './InfoSection/InfoSection';

export function RegisterPage() {
  const form = useForm({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    governorate: '',
    district: '',
    type: 'tenant',
    paymentMethod: '',
  });

  const userType = form.data.type;
  const setUserType = (type) => form.setData('type', type);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/register', {
      preserveScroll: true,
    });
  };



  // Adapter so child components can call setFormData({key: value}) or setFormData(fn)
  const formData = form.data;
  const setFormData = (updater: any) => {
    const updated = typeof updater === 'function' ? updater(form.data) : updater;
    Object.keys(updated).forEach((key) => {
      form.setData(key as any, updated[key as keyof typeof updated]);
    });
  };


  return (
    <main className="min-h-screen flex flex-col md:flex-row" dir="rtl">
      <FormSection
        userType={userType}
        setUserType={setUserType}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        agreeToTerms={agreeToTerms}
        setAgreeToTerms={setAgreeToTerms}
        errors={form.errors}
        processing={form.processing}
      />
      <InfoSection userType={userType} />
    </main>
  );
}

export default RegisterPage;
