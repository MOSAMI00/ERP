import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

/**
 * Hook to read owner page props from Inertia.
 * All data comes from the Laravel backend via Inertia props.
 * Provides safe defaults when data isn't available yet.
 *
 * @returns {{
 *   rentals: Array,
 *   reviews: Array,
 *   disputes: Array,
 *   handoverReports: Array,
 *   ownerNotifications: Array,
 *   stats: Object|null,
 *   paymentMethods: Array,
 * }}
 */
export function useOwnerPageProps() {
  const { props } = usePage();

  return useMemo(() => ({
    rentals: props.rentals ?? [],
    reviews: props.reviews ?? [],
    disputes: props.disputes ?? [],
    handoverReports: props.handover_reports ?? [],
    ownerNotifications: props.owner_notifications ?? [],
    stats: props.stats ?? null,
    paymentMethods: props.payment_methods ?? [],
  }), [props]);
}
