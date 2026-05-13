const NOTIFICATIONS_CONFIG = {
  tenant: {
    pageTitle: 'الإشعارات',
    unreadLabel: 'غير مقروءة',
    markAllReadLabel: 'تحديد الكل كمقروء',
    tabs: ['الكل', 'غير مقروءة'],
    emptyStateIcon: '🔔',
    emptyStateTitleAll: 'لا توجد إشعارات',
    emptyStateTitleUnread: 'لا توجد إشعارات غير مقروءة',
    emptyStateDesc: 'ستظهر هنا الإشعارات الجديدة عند وصولها',
    actions: {
      hasExternalLinks: true,
    }
  },
  owner: {
    pageTitle: 'الإشعارات',
    unreadLabel: 'غير مقروءة',
    markAllReadLabel: 'تحديد الكل كمقروء',
    tabs: ['الكل', 'غير مقروءة'],
    emptyStateIcon: '🔔',
    emptyStateTitleAll: 'لا توجد إشعارات',
    emptyStateTitleUnread: 'لا توجد إشعارات غير مقروءة',
    emptyStateDesc: 'ستظهر الإشعارات الجديدة هنا.',
    actions: {
      hasExternalLinks: true,
    }
  }
};

export function getNotificationsConfig(role) {
  return NOTIFICATIONS_CONFIG[role] || NOTIFICATIONS_CONFIG.tenant;
}
