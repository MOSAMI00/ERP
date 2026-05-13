import { Link, usePage } from '@inertiajs/react';

const bottomNavItems = [
  { emoji: '🏠', label: 'طلباتي', href: '/dashboard', exact: true },
  { emoji: '📦', label: 'تسليم', href: '/dashboard/delivery' },
  { emoji: '🔔', label: 'إشعارات', href: '/dashboard/notifications', badge: 0 },
  { emoji: '⭐', label: 'تقييم', href: '/dashboard/ratings' },
  { emoji: '👤', label: 'حساب', href: '/dashboard/settings' },
];

export function MobileBottomNav() {
  const { url, props } = usePage();
  const pathname = url;
  const unreadNotifications = props.unread_notifications_count ?? 0;
  const items = bottomNavItems.map((item) =>
    item.href === '/dashboard/notifications'
      ? { ...item, badge: unreadNotifications || undefined }
      : item,
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] z-40 flex items-stretch h-16">
      {items.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
              {item.emoji}
            </span>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#2D5A27]' : 'text-[#888888]'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2D5A27] rounded-full" />
            )}
            {item.badge && (
              <span className="absolute top-2 right-3 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
