import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';

const ORDER_COLORS = {
  pending: '#F39C12',
  confirmed: '#3498DB',
  in_use: '#E67E22',
  completed: '#27AE60',
  cancelled: '#95A5A6',
  disputed: '#E74C3C',
};

const buildMonthlyEarnings = (ownerRentals) => {
  const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
  const now = new Date();
  const rows = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = date.getMonth();
    const year = date.getFullYear();
    const amount = ownerRentals
      .filter((rental) => {
        const created = new Date(rental.created_at ?? rental.createdAt);
        return created.getMonth() === month && created.getFullYear() === year;
      })
      .reduce((total, rental) => total + (rental.rental_amount ?? rental.rentalAmount ?? 0), 0);
    rows.push({ name: formatter.format(date), amount });
  }
  return rows;
};

const buildOrderStatusData = (ownerRentals) => {
  const counters = ownerRentals.reduce((acc, rental) => {
    const key = rental.status;
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.keys(counters).map((status) => ({
    name: status,
    value: counters[status],
    color: ORDER_COLORS[status] ?? '#95A5A6',
  }));
};

export const useOwnerOverview = () => {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const { rentals, reviews } = useOwnerPageProps();

  const ownerRentals = useMemo(
    () => rentals.filter((rental) => (rental.owner_id ?? rental.ownerId) === user?.id),
    [rentals, user?.id],
  );

  const equipment = props.equipment ?? [];

  const ownerReviews = useMemo(
    () => reviews.filter((review) => (review.target_id ?? review.targetId) === user?.id),
    [reviews, user?.id],
  );

  const dataEarnings = useMemo(
    () => buildMonthlyEarnings(ownerRentals),
    [ownerRentals],
  );

  const dataOrders = useMemo(
    () => buildOrderStatusData(ownerRentals),
    [ownerRentals],
  );

  const totalRating = ownerReviews.reduce((sum, item) => sum + item.rating, 0);
  const averageRating = ownerReviews.length ? (totalRating / ownerReviews.length).toFixed(1) : '0.0';
  const monthEarnings = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const previousMonthEarnings = dataEarnings[dataEarnings.length - 2]?.amount ?? 0;
  const monthGrowth = previousMonthEarnings > 0
    ? Math.round(((monthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100)
    : 0;

  const recentRentals = ownerRentals
    .slice()
    .sort((a, b) => new Date(b.created_at ?? b.createdAt).getTime() - new Date(a.created_at ?? a.createdAt).getTime())
    .slice(0, 5);
  const activeOrders = ownerRentals.filter((item) => ['pending', 'confirmed', 'in_use'].includes(item.status)).length;

  return {
    activeOrders,
    averageRating,
    dataEarnings,
    dataOrders,
    equipmentCount: equipment.length,
    monthEarnings,
    monthGrowth,
    recentRentals,
    reviewsCount: ownerReviews.length,
  };
};
