import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { FormSection } from './FormSection/FormSection';
import { InfoSection } from './InfoSection/InfoSection';

export function RegisterPage() {
  const [userType, setUserType] = useState('tenant');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const form = useForm({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
    governorate: '',
    district: '',
    type: 'tenant',
  });

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
      data: { ...form.data, type: userType },
      preserveScroll: true,
    });
  };

  // Adapter so child components can call setFormData({key: value}) or setFormData(fn)
  const formData = form.data;
  const setFormData = (updater) => {
    if (typeof updater === 'function') {
      const updated = updater(form.data);
      Object.keys(updated).forEach((key) => form.setData(key, updated[key]));
    } else {
      Object.keys(updater).forEach((key) => form.setData(key, updater[key]));
    }
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
