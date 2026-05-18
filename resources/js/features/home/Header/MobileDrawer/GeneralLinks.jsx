import { Link } from '@inertiajs/react';
import { HelpCircle, Globe } from 'lucide-react';


export function GeneralLinks({ setMobileMenuOpen }) {
  return (
    <>
      <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">عام</p>
      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-muted text-sm block">الرئيسية</Link>
      <Link href="/" onClick={() => setMobileMenuOpen(false)} className="p-3 rounded-lg hover:bg-muted text-sm block">تصفح المعدات</Link>
      <Link href="/policies" onClick={() => setMobileMenuOpen(false)} className="w-full text-right p-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2">
        <HelpCircle className="w-4 h-4" /> مركز المساعدة
      </Link>
      <button onClick={() => setMobileMenuOpen(false)} className="w-full text-right p-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2">
        <Globe className="w-4 h-4" /> اللغة: العربية
      </button>
    </>
  );
}
