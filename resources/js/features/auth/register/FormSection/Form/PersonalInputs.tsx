import { User, Phone, Mail } from 'lucide-react';


export function PersonalInputs({ formData, setFormData }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <input
            type="text"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            placeholder="أدخل اسمك الكامل"
            className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">رقم الجوال</label>
        <div className="relative">
          <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#888888] flex items-center gap-1">
            <span className="text-base">🇾🇪</span>
            <span>+967</span>
          </div>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="770 123 456"
            className="w-full pr-12 pl-24 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
            dir="ltr"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          البريد الإلكتروني{' '}
          <span className="text-[#888888] font-normal">(اختياري)</span>
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="example@email.com"
            className="w-full pr-12 pl-4 h-12 rounded-lg border border-[#E0E0E0] focus:border-[#2D5A27] focus:outline-none"
            dir="ltr"
          />
        </div>
      </div>
    </>
  );
}
