import { Bell } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

export function NotificationBell() {
  const { props } = usePage<any>();
  const notificationCount = props.unread_notifications_count ?? props.notifications_count ?? 0;
  const role = props.auth?.user?.type;
  const href = role === 'owner' ? '/owner/notifications' : '/dashboard/notifications';

  return (
    <button
      type="button"
      onClick={() => router.visit(href)}
      className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      aria-label="الإشعارات"
    >
      <Bell className="w-5 h-5" />
      {notificationCount > 0 && (
        <span className="absolute top-1 left-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
