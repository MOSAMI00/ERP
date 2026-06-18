import { usePage } from '@inertiajs/react';
import { UserHeader } from './UserHeader';
import { DashboardLinks } from './DashboardLinks';
import { GeneralLinks } from './GeneralLinks';
import { AuthActions } from './AuthActions';

export function MobileDrawer({ mobileMenuOpen, setMobileMenuOpen }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const isTenant = user?.type === 'tenant';

  if (!mobileMenuOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 top-[112px] bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)}>
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-lg overflow-y-auto" onClick={e => e.stopPropagation()} style={{ direction: 'rtl' }}>
        {user && isTenant && <UserHeader />}
        
        <nav className="flex flex-col p-4 gap-1">
          {user && isTenant && (
            <>
              <DashboardLinks setMobileMenuOpen={setMobileMenuOpen} />
              <hr className="my-3 border-border" />
            </>
          )}
          <GeneralLinks setMobileMenuOpen={setMobileMenuOpen} />
          <hr className="my-3 border-border" />
          <AuthActions setMobileMenuOpen={setMobileMenuOpen} />
        </nav>
      </div>
    </div>
  );
}
