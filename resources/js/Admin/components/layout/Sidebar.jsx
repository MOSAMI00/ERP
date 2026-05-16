import { Link, router, usePage } from "@inertiajs/react";
import { LogOut, X } from "lucide-react";

export default function Sidebar({ isSidebarOpen, onClose, navItems }) {
  const { url, props } = usePage();
  const admin = props.auth.admin || { role: 'Admin' };

  return (
    <aside
      className={`
      fixed lg:static inset-y-0 right-0 z-50
      w-64 bg-brand-sidebar text-white flex flex-col transition-transform duration-300 ease-in-out
      ${isSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
    `}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Admin Panel
          </h1>
          <span className="text-xs text-brand-success mt-1 px-2 py-0.5 bg-brand-success/10 rounded w-fit uppercase font-bold">
            {admin.role.replace('_', ' ')}
          </span>
        </div>
        <button
          className="lg:hidden text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} className="px-3">
                <Link
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 space-x-reverse px-4 py-2.5 rounded-lg transition-colors relative ${url.startsWith(new URL(item.path, window.location.origin).pathname)
                      ? "bg-brand-primary text-white"
                      : "text-gray-300 hover:bg-brand-sidebar-hover hover:text-white"
                    }`}
                >
                  {url.startsWith(new URL(item.path, window.location.origin).pathname) && (
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-white rounded-r-full" />
                  )}
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          type="button"
          onClick={() => router.post(route('admin.logout'))}
          className="flex items-center space-x-3 space-x-reverse px-4 py-3 w-full text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
