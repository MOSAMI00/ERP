import { useRef, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Camera, CheckCircle } from 'lucide-react';
import { assetUrl } from '../../../utils/pageData';

export function ProfileForm({ auth }) {
  const user = auth?.user ?? {};
  const [saved, setSaved] = useState(false);
  const fileRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar ? assetUrl(user.avatar) : null);

  const form = useForm({
    _method: 'PUT',
    full_name: user.full_name ?? '',
    phone: user.phone ?? '',
    governorate: user.governorate ?? '',
    avatar: null,
  });

  const handleSave = (event) => {
    event.preventDefault();
    form.post('/user/profile', {
      onSuccess: () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      },
    });
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#2D5A27] bg-[#2D5A27] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {previewUrl ? (
              <img src={previewUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (form.data.full_name || 'أ').charAt(0)
            )}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center shadow-md hover:bg-[#3D7A35] transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0] ?? null;
              form.setData('avatar', file);
              if (file) {
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'الاسم الكامل', key: 'full_name', type: 'text' },
          { label: 'رقم الهاتف', key: 'phone', type: 'tel' },
          { label: 'المحافظة', key: 'governorate', type: 'text' },
        ].map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-semibold text-[#222222] mb-1.5">{field.label}</label>
            <input
              type={field.type}
              value={form.data[field.key] ?? ''}
              onChange={(event) => form.setData(field.key, event.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
            />
            {form.errors[field.key] && <p className="text-xs text-red-500 mt-1">{form.errors[field.key]}</p>}
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
        {saved ? <><CheckCircle className="w-4 h-4" /> تم الحفظ</> : form.processing ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </button>
    </form>
  );
}
