import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  ClipboardList, Package, FileText, Bell, Star, Settings,
  LogOut, Shield, X
} from 'lucide-react';
import { SidebarContent } from './Sidebar';
import { DashboardTopbar } from './Topbar';
import { MobileBottomNav } from './MobileBottomNav';
import { visit } from '../../inertia/navigation';
import { assetUrl } from '../../utils/pageData';

const navItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋', exact: true },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔', badge: 0 },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Shield, label: 'التأمينات', href: '/dashboard/insurance', emoji: '🛡️' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];

const pageTitles = {
  '/dashboard': 'طلباتي',
  '/dashboard/delivery': 'التسليم والإرجاع',
  '/dashboard/contracts': 'عقودي',
  '/dashboard/notifications': 'الإشعارات',
  '/dashboard/ratings': 'تقييماتي',
  '/dashboard/insurance': 'التأمينات',
  '/dashboard/settings': 'الإعدادات',
};

export function TenantLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { props, url } = usePage();
  const pathname = url;

  const auth = props.auth as any;
  const user = auth?.user ?? null;
  const userName = user?.full_name || 'مستأجر';
  const userSubtitle = user?.email || '';
  const userInitial = (userName || 'أ').charAt(0);
  const userAvatar = user?.avatar ? assetUrl(user.avatar) : null;

  const unreadNotifications = props.unread_notifications_count ?? 0;
  const navItemsWithBadges = navItems.map((item) =>
    item.href === '/dashboard/notifications'
      ? { ...item, badge: unreadNotifications || undefined }
      : item,
  );

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  const currentTitle = pathname.includes('/delivery')
    ? 'التسليم والإرجاع'
    : pathname.startsWith('/dashboard/order/')
      ? 'تفاصيل الطلب'
      : Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(path + '/'))?.[1] ?? 'لوحة التحكم';

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <SidebarContent
          navItems={navItemsWithBadges}
          onClose={() => { }}
          userName={userName}
          userSubtitle={userSubtitle}
          userInitial={userInitial}
          userAvatar={userAvatar}
        />
      </aside>

      {/* Tablet Sidebar – icon-only */}
      <aside className="hidden md:flex lg:hidden flex-col w-[68px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <div className="flex flex-col items-center py-5 gap-1 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#2D5A27] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">م</span>
          </div>
          {navItemsWithBadges.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${isActive ? 'bg-[#2D5A27] text-white' : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#2D5A27]'
                  }`}
              >
                <span className="text-xl">{item.emoji}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="mt-auto mb-2">
            <Link
              href="/logout"
              method="post"
              as="button"
              title="تسجيل الخروج"
              className="w-12 h-12 flex items-center justify-center rounded-xl text-[#E74C3C] hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[260px] bg-white h-full flex flex-col shadow-2xl" style={{ right: 0, left: 'auto', position: 'absolute' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-[#F4F6F9]"
            >
              <X className="w-5 h-5 text-[#888888]" />
            </button>
            <SidebarContent
              navItems={navItemsWithBadges}
              onClose={() => setSidebarOpen(false)}
              userName={userName}
              userSubtitle={userSubtitle}
              userInitial={userInitial}
              userAvatar={userAvatar}
            />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopbar
          title={currentTitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          unreadNotifications={unreadNotifications}
          user={user}
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default TenantLayout;
