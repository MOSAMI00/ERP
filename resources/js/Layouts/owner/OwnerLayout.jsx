import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { visit } from '../../inertia/navigation';
import { useOwnerPageProps } from '../../inertia/owner-page-props';
import OwnerBottomNav from './OwnerBottomNav';
import OwnerSidebar from './OwnerSidebar';
import OwnerTopbar from './OwnerTopbar';
import { createOwnerNavItems, getOwnerPageTitle, ownerBottomNavItems } from './navigation';

const OwnerLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { props, url } = usePage();
  const user = props.auth?.user ?? null;
  const { rentals, ownerNotifications } = useOwnerPageProps();
  const pathname = url;
  const pendingRequests = rentals.filter((rental) => rental.owner_id === user?.id && rental.status === 'pending').length;
  const unreadOwnerNotifs = ownerNotifications.filter((n) => !n.read).length;
  const ownerInitial = (user?.full_name ?? user?.fullName ?? '؟').charAt(0);
  const navItems = createOwnerNavItems({ pendingRequests, unreadOwnerNotifs });
  const pageTitle = getOwnerPageTitle(pathname, navItems);

  const handleNavigate = (path) => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    visit(path);
  };

  const handleLogout = () => {
    visit('/logout', { method: 'post' });
  };

  return (
    <div className="owner-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <OwnerSidebar
        isOpen={isSidebarOpen}
        navItems={navItems}
        pathname={pathname}
        user={user}
        ownerInitial={ownerInitial}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <div className="owner-main">
        <OwnerTopbar
          title={pageTitle}
          unreadCount={unreadOwnerNotifs}
          user={user}
          ownerInitial={ownerInitial}
          isProfileOpen={isProfileOpen}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
          onToggleProfile={() => setIsProfileOpen((current) => !current)}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <div className="owner-content">
          {children}
        </div>
      </div>

      <OwnerBottomNav items={ownerBottomNavItems} pathname={pathname} onNavigate={handleNavigate} />
    </div>
  );
};

export default OwnerLayout;
