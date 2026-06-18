import { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';

/**
 * Generalized SecurityForm — shared between tenant and owner settings.
 * Moved from components/tenant/Dashboard/Settings/Main/SettingsLayout/ContentArea/SecurityForm.
 */
export function SecurityForm() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const strength = newPw.length === 0 ? 0 : newPw.length < 6 ? 1 : newPw.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'ضعيف', 'متوسط', 'قوي'];
  const strengthColors = ['', '#E74C3C', '#F39C12', '#27AE60'];

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-xl flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#2D5A27]" />
        <p className="text-sm text-[#2D5A27] font-medium">حسابك محمي. آخر تسجيل دخول: اليوم الساعة 10:30 صباحاً</p>
      </div>

      <h3 className="font-bold text-[#222222]">تغيير كلمة المرور</h3>

      {[
        { label: 'كلمة المرور الحالية', value: oldPw, setter: setOldPw, show: showOld, toggle: () => setShowOld(!showOld) },
        { label: 'كلمة المرور الجديدة', value: newPw, setter: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
        { label: 'تأكيد كلمة المرور', value: confirmPw, setter: setConfirmPw, show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
      ].map((field, i) => (
        <div key={i}>
          <label className="block text-sm font-semibold text-[#222222] mb-1.5">{field.label}</label>
          <div className="relative">
            <input
              type={field.show ? 'text' : 'password'}
              value={field.value}
              onChange={e => field.setter(e.target.value)}
              className="w-full h-11 pr-4 pl-11 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={field.toggle}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#222222]"
            >
              {field.show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {i === 1 && newPw.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1,2,3].map(s => (
                  <div key={s} className="flex-1 h-1.5 rounded-full transition-all" style={{ backgroundColor: strength >= s ? strengthColors[strength] : '#E0E0E0' }} />
                ))}
              </div>
              <p className="text-xs mt-1" style={{ color: strengthColors[strength] }}>{strengthLabels[strength]}</p>
            </div>
          )}
        </div>
      ))}

      <button
        disabled={!oldPw || !newPw || newPw !== confirmPw}
        className="h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        تغيير كلمة المرور
      </button>

      <div className="border-t border-[#E0E0E0] pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#222222] text-sm">المصادقة الثنائية</p>
            <p className="text-xs text-[#888888] mt-0.5">حماية إضافية لحسابك</p>
          </div>
          <div className="relative">
            <input type="checkbox" id="2fa" className="sr-only" />
            <label htmlFor="2fa" className="w-11 h-6 bg-[#E0E0E0] rounded-full cursor-pointer flex items-center px-0.5 transition-colors has-[:checked]:bg-[#2D5A27]">
              <span className="w-5 h-5 bg-white rounded-full shadow transition-transform" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
