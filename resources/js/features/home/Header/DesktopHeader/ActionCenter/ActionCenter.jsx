import { usePage } from '@inertiajs/react';
import { LocationSelector } from './LocationSelector';
import { HelpCenter } from './HelpCenter';
import { Wishlist } from './Wishlist';
import { NotificationBell } from './NotificationBell';
import { CartButton } from './CartButton';
import { AuthButtons } from './AuthButtons';
import { UserProfileMenu } from './UserProfileMenu';

export function ActionCenter() {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const isTenant = user?.type === 'tenant';

  return (
    <div className="flex items-center gap-4">
      <LocationSelector />
      <div className="w-px h-6 bg-border mx-1" />
      <HelpCenter />
      <Wishlist />
      <NotificationBell />
      <CartButton />
      {user && isTenant ? (
        <UserProfileMenu />
      ) : (
        <AuthButtons />
      )}
    </div>
  );
}
