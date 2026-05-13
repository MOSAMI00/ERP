import React from 'react';
import { LogOut } from 'lucide-react';

const OwnerProfileSummary = ({ user, ownerInitial }) => (
  <div className="owner-profile-summary">
    <div className="owner-profile-pic">
      <div className="flex-center" style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--color-page-bg)', fontWeight: 700 }}>
        {ownerInitial}
      </div>
    </div>
    <h3 style={{ margin: '8px 0 2px', fontSize: '16px' }}>{user?.fullName ?? 'أحمد المؤجر'}</h3>
    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
      متجر المعدات
    </span>
    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 4 }}>
      صنعاء | مؤجر <span style={{ color: 'var(--color-completed)' }}>معتمد</span>
    </span>
    <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: 4 }}>4.8 | 102 عملية</span>
  </div>
);

const OwnerSidebar = ({
  isOpen,
  navItems,
  pathname,
  user,
  ownerInitial,
  onNavigate,
  onLogout,
}) => (
  <div className={`owner-sidebar ${isOpen ? 'drawer-open' : ''}`}>
    <div className="owner-sidebar-header">
      <h2 style={{ margin: 0 }}>منصة التأجير</h2>
      <OwnerProfileSummary user={user} ownerInitial={ownerInitial} />
    </div>

    <div className="owner-nav">
      {navItems.map((item) => (
        <button
          key={item.path}
          className={`owner-nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
          style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}
          type="button"
          onClick={() => onNavigate(item.path)}
        >
          {item.icon}
          <span>{item.name}</span>
          {item.badge ? (
            <span className={`owner-nav-badge ${item.badgeRed ? 'owner-nav-badge-red' : ''}`}>
              {item.badge}
            </span>
          ) : null}
        </button>
      ))}
    </div>

    <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
      <button
        onClick={onLogout}
        className="owner-nav-item"
        style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-disputed)', fontFamily: 'inherit', fontSize: 14 }}
        type="button"
      >
        <LogOut size={20} />
        <span>تسجيل الخروج</span>
      </button>
    </div>
  </div>
);

export default OwnerSidebar;
