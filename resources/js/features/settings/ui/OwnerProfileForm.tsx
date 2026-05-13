import React, { useState, useRef } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Camera, CheckCircle } from 'lucide-react';

export function OwnerProfileForm() {
  const { props } = usePage();
  const user = props.auth?.user ?? {};

  const form = useForm({
    full_name: user.full_name ?? user.fullName ?? '',    phone: user.phone ?? '',    governorate: user.governorate ?? '',  });

  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);

  const handleSave = (e) => {
    e.preventDefault();
    form.put('/user/profile', {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  const ownerInitial = (form.data.full_name || 'أ').charAt(0);

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {ownerInitial}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-md hover:bg-[#3D7A35] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" />
        </div>
        <p className="text-sm text-[#888888]">شعار النشاط / صورة المؤجر</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'الاسم الكامل', key: 'full_name', icon: '👤', type: 'text' },          { label: 'رقم الهاتف', key: 'phone', icon: '📱', type: 'tel' },
          { label: 'المحافظة', key: 'governorate', icon: '📍', type: 'text' },        ].map(field => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-[#222222] mb-1.5">{field.label}</label>
            <div className="relative">
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base">{field.icon}</span>
              <input
                type={field.type}
                value={form.data[field.key]}
                onChange={e => form.setData(field.key, e.target.value)}
                className="w-full h-11 pr-10 pl-4 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
              />
            </div>
            {form.errors[field.key] && (
              <p className="text-xs text-red-500 mt-1">{form.errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={form.processing}
        className={`h-12 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
          saved ? 'bg-[#27AE60] text-white' : 'bg-[#2D5A27] text-white hover:bg-[#3D7A35]'
        }`}
      >
        {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ!</> : form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
export default OwnerProfileForm;
