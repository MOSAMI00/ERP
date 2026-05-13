import { Link } from '@inertiajs/react';
import { Menu, Home, Bell } from 'lucide-react';

export function DashboardTopbar({
  title,
  subtitle = 'لوحة تحكم المستأجر',
  onOpenSidebar,
  unreadNotifications = 0,
}) {
  return (
    <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#F4F6F9] transition-colors"
          onClick={onOpenSidebar}
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5 text-[#222222]" />
        </button>
        <div>
          <h1 className="font-bold text-[#222222] text-lg leading-tight">{title}</h1>
          <p className="text-xs text-[#888888] hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="hidden md:flex items-center gap-1 text-xs text-[#888888] hover:text-[#2D5A27] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F4F6F9]"
        >
          <Home className="w-4 h-4" />
          <span>الموقع</span>
        </Link>

        <Link
          href="/dashboard/notifications"
          className="relative p-2 rounded-lg hover:bg-[#F4F6F9] transition-colors"
        >
          <Bell className="w-5 h-5 text-[#888888]" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </Link>

        <div className="w-9 h-9 rounded-full bg-[#2D5A27] text-white flex items-center justify-center font-bold text-sm cursor-pointer">
          أ
        </div>
      </div>
    </header>
  );
}
