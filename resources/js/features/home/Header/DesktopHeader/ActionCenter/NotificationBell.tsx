import { Bell } from 'lucide-react';
import { useState } from 'react';

export function NotificationBell() {
  const [notificationCount] = useState(3);

  return (
    <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
      <Bell className="w-5 h-5" />
      {notificationCount > 0 && (
        <span className="absolute top-1 left-1 w-5 h-5 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
          {notificationCount}
        </span>
      )}
    </button>
  );
}
