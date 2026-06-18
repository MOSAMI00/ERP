import { Link, usePage } from '@inertiajs/react';
import { ClipboardList, Package, FileText, Bell, Star, Settings, Shield, Home, Wrench } from 'lucide-react';

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

export function DashboardLinks({ setMobileMenuOpen }) {
  const { auth } = usePage().props as any;
  const user = auth?.user;

  
  const menuItems = user?.type === 'owner' ? ownerMenuItems : tenantMenuItems;

  return (
    <>
      <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">لوحة التحكم</p>
      {menuItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F4F6F9] text-[#222222]"
        >
          <span>{item.emoji}</span>
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}
    </>
  );
}

