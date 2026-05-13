import React from 'react';
import { Bell, ChevronDown, LogOut, Menu, User } from 'lucide-react';

const OwnerTopbar = ({
  title,
  unreadCount,
  user,
  ownerInitial,
  isProfileOpen,
  onMenuClick,
  onToggleProfile,
  onNavigate,
  onLogout,
}) => (
  <div className="owner-topbar">
    <div className="owner-topbar-right">
      <button
        className="mobile-menu-btn"
        onClick={onMenuClick}
        aria-label="القائمة"
        type="button"
      >
        <Menu size={24} />
      </button>
      <h3 className="owner-topbar-title">{title}</h3>
    </div>

    <div className="owner-topbar-left">
      <button
        type="button"
        onClick={() => onNavigate('/owner/notifications')}
        style={{ position: 'relative', color: 'var(--color-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}
      >
        <Bell size={22} />
        {unreadCount > 0 ? <span className="topbar-notification-badge">{unreadCount}</span> : null}
      </button>

      <div className="topbar-profile" onClick={onToggleProfile}>
        <div className="flex-center" style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--color-page-bg)', fontWeight: 700 }}>
          {ownerInitial}
        </div>
        <span>{user?.fullName?.split(' ')[0] ?? 'أحمد'}</span>
        <ChevronDown size={16} />
        {isProfileOpen ? (
          <div className="topbar-dropdown">
            <button
              type="button"
              className="topbar-dropdown-item"
              style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}
              onClick={() => onNavigate('/owner/profile')}
            >
              <User size={16} /> ملفي الشخصي
            </button>
            <button
              type="button"
              onClick={onLogout}
              className="topbar-dropdown-item"
              style={{ color: 'var(--color-disputed)', width: '100%', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}
            >
              <LogOut size={16} /> تسجيل الخروج
            </button>
          </div>
        ) : null}
      </div>
    </div>
  </div>
);

export default OwnerTopbar;
