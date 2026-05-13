import { Link } from '@inertiajs/react';
import { PhoneInput } from './PhoneInput';
import { PasswordInput } from './PasswordInput';
import { LoginButton } from './LoginButton';
import { SocialButtons } from './SocialButtons';


export function Form({ formData, setFormData, handleSubmit, errors = {} }) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PhoneInput
        phone={formData.phone}
        setPhone={(val) => setFormData({ ...formData, phone: val })}
      />
      {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}

      <PasswordInput
        password={formData.password}
        setPassword={(val) => setFormData({ ...formData, password: val })}
      />
      {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}

      {/* Forgot Password */}
      <div className="text-left">
        <button type="button" className="text-primary hover:underline text-sm">
          نسيت كلمة المرور؟
        </button>
      </div>

      <LoginButton />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-muted-foreground">أو</span>
        </div>
      </div>

      <SocialButtons />

      {/* Register Link */}
      <p className="text-center text-sm text-muted-foreground">
        ليس لديك حساب؟{' '}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          إنشاء حساب جديد
        </Link>
      </p>
    </form>
  );
}
