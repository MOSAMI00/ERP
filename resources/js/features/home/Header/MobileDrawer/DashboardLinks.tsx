import { Link } from '@inertiajs/react';
import { ClipboardList, Package, FileText, Bell, Star, Settings, Shield } from 'lucide-react';

const accountMenuItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋' },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Shield, label: 'التأمينات', href: '/dashboard/insurance', emoji: '🛡️' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔' },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];


export function DashboardLinks({ setMobileMenuOpen }) {
  return (
    <>
      <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">لوحة التحكم</p>
      {accountMenuItems.map((item) => (
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
