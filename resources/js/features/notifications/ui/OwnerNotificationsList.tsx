import React from 'react';
import { EmptyState } from '../../../components/shared';
import { NotificationCard } from './NotificationCard';

export function OwnerNotificationsList({ displayed, onOpen, config, activeTab }) {
  return displayed.length > 0 ? (
    <div className="flex flex-col gap-3">
      {displayed.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onOpen={onOpen}
        />
      ))}
    </div>
  ) : (
    <EmptyState
      icon={config.emptyStateIcon}
      title={activeTab === config.tabs[1] ? config.emptyStateTitleUnread : config.emptyStateTitleAll}
      description={config.emptyStateDesc}
    />
  );
}
