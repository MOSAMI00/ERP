import { Link, router } from '@inertiajs/react';

export function AuthActions({ setMobileMenuOpen }) {
  const { auth } = usePage().props;
  const user = auth?.user ?? null;

  return (
    <>
      {!user ? (
        <>
          <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-muted block text-sm">تسجيل الدخول</Link>
          <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="p-3 text-right rounded-lg bg-primary text-white block text-sm mt-2">سجل الآن</Link>
        </>
      ) : (
        <button
          onClick={() => { 
            setMobileMenuOpen(false); 
            router.post('/logout');
          }}
          className="p-3 text-right rounded-lg text-[#E74C3C] hover:bg-red-50 text-sm flex items-center gap-2 w-full"
        >
          <span>🔴</span> تسجيل الخروج
        </button>
      )}
    </>
  );
}
