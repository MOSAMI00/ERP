import { usePage } from '@inertiajs/react';

export function UserHeader() {
  const { props } = usePage();
  const user = props.auth?.user ?? null;

  if (!user) return null;

  const fullName = user.full_name ?? user.fullName ?? 'مستخدم';
  const firstLetter = fullName.charAt(0);

  return (
    <div className="p-4 bg-[#F4F6F9] border-b border-border flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">{firstLetter}</div>
      <div>
        <p className="font-semibold text-[#222222]">{fullName}</p>
        <p className="text-xs text-[#888888]">{user.phone || 'بدون رقم'}</p>
      </div>
    </div>
  );
}
