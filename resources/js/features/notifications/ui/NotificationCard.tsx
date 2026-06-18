import React from 'react';

function getNotificationTypeIcon(type) {
  switch (type) {
    case 'payment': return '💰';
    case 'order': return '✅';
    case 'return': return '📦';
    case 'review': return '⭐';
    case 'dispute': return '⚠️';
    case 'system': return '🔔';
    default: return '🔔';
  }
}

function getNotificationTypeColor(type) {
  switch (type) {
    case 'payment': return '#F59E0B';
    case 'order': return '#10B981';
    case 'return': return '#3B82F6';
    case 'review': return '#8B5CF6';
    case 'dispute': return '#EF4444';
    case 'system': return '#6B7280';
    default: return '#6B7280';
  }
}

export function NotificationCard({ notification, onOpen }) {
  const icon = notification.emoji || getNotificationTypeIcon(notification.type);
  const color = getNotificationTypeColor(notification.type);
  const bg = `${color}18`;
  const isRead = notification.read ?? notification.is_read;
  const message = notification.message ?? notification.body;
  const time = notification.time ?? notification.created_at ?? notification.createdAt ?? '';
  const actionUrl = notification.action_url ?? notification.actionUrl ?? notification.action?.href;

  return (
    <button
      type="button"
      onClick={() => onOpen(notification)}
      className="w-full text-right"
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        border: '1px solid #E0E0E0',
        borderRadius: '12px',
        backgroundColor: isRead ? '#FFFFFF' : bg,
        borderRight: isRead ? '1px solid #E0E0E0' : `4px solid ${color}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          backgroundColor: isRead ? bg : '#FFFFFF',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h4
            style={{
              margin: 0,
              color: isRead ? '#222222' : color,
              fontSize: '15px',
              fontWeight: 600,
            }}
          >
            {notification.title}
          </h4>
          <span style={{ fontSize: '12px', color: '#888888' }}>{time}</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#555555' }}>
          {message}
        </p>
        {actionUrl ? (
          <span
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '12px',
              color: '#2D5A27',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            {notification.action?.label ?? 'فتح التفاصيل'}
          </span>
        ) : null}
      </div>
      {!isRead ? (
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
            marginTop: '6px',
          }}
        />
      ) : null}
    </button>
  );
}
