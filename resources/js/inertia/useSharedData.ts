import { usePage } from '@inertiajs/react';
import type { SharedPageProps } from '@/types/inertia';

export function useSharedData() {
  const { props } = usePage<SharedPageProps>();

  return {
    auth: props.auth,
    flash: props.flash,
    notificationsCount: props.notifications_count ?? 0,
    unreadNotificationsCount: props.unread_notifications_count ?? 0,
    governorates: props.sharedData?.governorates ?? [],
    statuses: props.sharedData?.statuses ?? {
      rental: [],
      payment: [],
      equipment: [],
      kyc: [],
    },
  };
}
