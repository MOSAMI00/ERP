import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { visit } from '../../inertia/navigation';
import { getNotificationsConfig } from './lib/notificationsConfig';
import { TenantNotificationsList } from './ui/TenantNotificationsList';
import { OwnerNotificationsList } from './ui/OwnerNotificationsList';
import { PageHeader, FilterTabs } from '../../components/shared';

export default function NotificationsPage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || 'tenant';
  const config = getNotificationsConfig(role);

  const rawNotifications = props.notifications ?? props.owner_notifications ?? [];
  const allNotifications = Array.isArray(rawNotifications) ? rawNotifications : (rawNotifications.data ?? []);
  const [activeTab, setActiveTab] = useState(config.tabs[0]);

  const unreadCount = allNotifications.filter((n) => !(n.read ?? n.is_read)).length;

  const displayed = activeTab === config.tabs[1]
    ? allNotifications.filter((n) => !(n.read ?? n.is_read))
    : allNotifications;

  const handleMarkAllRead = () => {
    router.post('/notifications/read-all', {}, {
      preserveScroll: true,
    });
  };

  const handleOpenNotification = (notification) => {
    router.patch(`/notifications/${notification.id}/read`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        const actionUrl = notification.action_url ?? notification.actionUrl ?? notification.action?.href;
        if (actionUrl) {
          visit(actionUrl);
        }
      },
    });
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={`${unreadCount} ${config.unreadLabel}`}
        actions={
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-sm font-semibold text-[#2D5A27] hover:underline disabled:opacity-50"
          >
            {config.markAllReadLabel}
          </button>
        }
      />

      <FilterTabs
        tabs={config.tabs.map((tab) => ({
          id: tab,
          label: tab,
          count: tab === config.tabs[1] ? unreadCount : allNotifications.length,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {role === 'tenant' ? (
        <TenantNotificationsList
          displayed={displayed}
          onOpen={handleOpenNotification}
          config={config}
          activeTab={activeTab}
        />
      ) : (
        <OwnerNotificationsList
          displayed={displayed}
          onOpen={handleOpenNotification}
          config={config}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
