import React from 'react';

const OwnerBottomNav = ({ items, pathname, onNavigate }) => (
  <div className="mobile-bottom-nav">
    {items.map((item) => (
      <button
        key={item.path}
        type="button"
        className={`bottom-nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
        style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
        onClick={() => onNavigate(item.path)}
      >
        {item.icon}
        <span>{item.name}</span>
      </button>
    ))}
  </div>
);

export default OwnerBottomNav;
