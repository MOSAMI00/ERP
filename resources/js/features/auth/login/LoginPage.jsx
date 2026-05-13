import { useForm } from '@inertiajs/react';
import { FormSection } from './FormSection/FormSection';
import { PromoSection } from './PromoSection/PromoSection';

export function LoginPage() {
  const form = useForm({
    phone: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post('/login', { preserveScroll: true });
  };

  return (
    <main className="min-h-screen flex">
      <FormSection
        formData={form.data}
        setFormData={(updater) => {
          if (typeof updater === 'function') {
            const updated = updater(form.data);
            Object.keys(updated).forEach((key) => form.setData(key, updated[key]));
          } else {
            Object.keys(updater).forEach((key) => form.setData(key, updater[key]));
          }
        }}
        handleSubmit={handleSubmit}
        errors={form.errors}
        processing={form.processing}
      />
      <PromoSection />
    </main>
  );
}

export default LoginPage;
