import { Link, usePage } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { visit } from '../../inertia/navigation';

export function SidebarContent({
  navItems,
  onClose,
  userName = 'أحمد محمد',
  userSubtitle = 'ahmed@example.com',
  userInitial = 'أ',
  onLogout,
}) {
  const { url } = usePage();
  const pathname = url;

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">م</span>
          </div>
          <div>
            <p className="font-bold text-[#222222] text-sm leading-tight">منصة تأجير</p>
            <p className="text-xs text-[#888888]">المعدات</p>
          </div>
        </div>
      </div>

      {/* User Avatar */}
      <div className="px-5 py-4 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
            {userInitial}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#222222] text-sm truncate">{userName}</p>
            <p className="text-xs text-[#888888] truncate">{userSubtitle}</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${isActive
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#222222]'
                  }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`mr-auto w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white text-[#2D5A27]' : 'bg-[#E74C3C] text-white'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E0E0E0]">
        <Link
          href="/logout"
          method="post"
          as="button"
          onClick={() => {
            onClose();
            if (onLogout) onLogout();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E74C3C] hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🔴</span>
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </Link>
      </div>
    </div>
  );
}
