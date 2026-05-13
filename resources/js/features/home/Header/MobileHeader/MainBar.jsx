import { Menu, X, Bell, ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';


export function MainBar({ mobileMenuOpen, setMobileMenuOpen, notificationCount }) {
  return (
    <div className="flex items-center justify-between h-14 px-4 border-b border-border">
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2">
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-white font-bold">م</span>
        </div>
        <span className="font-bold text-primary">منصة تأجير المعدات</span>
      </Link>

      <div className="flex items-center gap-2">
        <button className="relative p-2">
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 left-0 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        <Link href="/cart" className="relative p-2">
          <ShoppingCart className="w-5 h-5 text-foreground" />
          <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
            1
          </span>
        </Link>
        <Link href="/dashboard" className="p-1">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
            أ
          </div>
        </Link>
      </div>
    </div>
  );
}
