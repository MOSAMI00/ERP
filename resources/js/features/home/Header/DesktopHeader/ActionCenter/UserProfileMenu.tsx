import { ClipboardList, Package, FileText, Bell, Star, Settings, Shield, Home, Wrench } from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const tenantMenuItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋' },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Shield, label: 'التأمينات', href: '/dashboard/insurance', emoji: '🛡️' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔' },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];

const ownerMenuItems = [
  { icon: Home, label: 'الرئيسية', href: '/owner/overview', emoji: '🏠' },
  { icon: Wrench, label: 'معداتي', href: '/owner/equipment', emoji: '🔧' },
  { icon: Package, label: 'التسليم والإرجاع', href: '/owner/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/owner/contracts', emoji: '📄' },
  { icon: Shield, label: 'التأمينات', href: '/owner/insurance', emoji: '🛡️' },
  { icon: Bell, label: 'الإشعارات', href: '/owner/notifications', emoji: '🔔' },
  { icon: Star, label: 'تقييماتي', href: '/owner/reviews', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/owner/profile', emoji: '⚙️' },
];

export function UserProfileMenu() {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const accountMenuItems = useMemo(() => {
    if (!user) return tenantMenuItems;
    return user.type === 'owner' ? ownerMenuItems : tenantMenuItems;
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const fullName = user.full_name ?? user.fullName ?? 'مستخدم';
  const firstLetter = fullName.charAt(0);

  return (
    <div className="relative" ref={accountMenuRef}>
      <button
        id="account-avatar-btn"
        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm hover:bg-primary/90 transition-all ring-2 ring-transparent hover:ring-primary/30 focus:outline-none"
        aria-label="فتح قائمة الحساب"
      >
        {firstLetter}
      </button>

      {/* Account Dropdown Menu */}
      {accountMenuOpen && (
        <div
          id="account-dropdown"
          className="absolute left-0 top-14 w-56 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
          style={{ direction: 'rtl' }}
        >
          {/* User Info Header */}
          <div className="px-4 py-3 bg-[#F4F6F9] border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">{firstLetter}</div>
              <div>
                <p className="font-semibold text-[#222222] text-sm">{fullName}</p>
                <p className="text-xs text-[#888888]">{user.phone || 'بدون رقم'}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="py-1">
            {accountMenuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAccountMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#222222] hover:bg-[#F4F6F9] transition-colors"
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="border-t border-border py-1">
            <button
              id="logout-btn"
              onClick={() => { 
                setAccountMenuOpen(false); 
                router.post('/logout');
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#E74C3C] hover:bg-red-50 transition-colors"
            >
              <span className="text-base">🔴</span>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
