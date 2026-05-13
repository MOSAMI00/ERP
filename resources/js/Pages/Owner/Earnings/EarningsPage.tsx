import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import { PageHeader } from '../../../components/shared';
import EarningsKpis from './components/EarningsKpis';
import EarningsChart from './components/EarningsChart';
import PayoutMethodCard from './PayoutMethodCard';
import PaymentsTable from './components/PaymentsTable';
import PayoutMethodModal from './PayoutMethodModal';

const Earnings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const { rentals } = useOwnerPageProps();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(
    () => rentals.filter((rental) => (rental.owner_id ?? rental.ownerId) === user?.id),
    [rentals, user?.id],
  );

  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i -= 1) {
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
  }, [ownerRentals]);

  const thisMonth = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const total = ownerRentals.reduce((sum, rental) => sum + (rental.rental_amount ?? rental.rentalAmount ?? 0), 0);
  const pendingTransfer = ownerRentals
    .filter((rental) => (rental.payment_status ?? rental.paymentStatus) === 'paid' && (rental.escrow_status ?? rental.escrowStatus) === 'held')
    .reduce((sum, rental) => sum + (rental.rental_amount ?? rental.rentalAmount ?? 0), 0);
  const transferred = Math.max(0, total - pendingTransfer);
  const paymentsRows = ownerRentals
    .slice()
    .sort((a, b) => new Date(b.created_at ?? b.createdAt).getTime() - new Date(a.created_at ?? a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div>
      <PageHeader title="الأرباح والمدفوعات" />

      <EarningsKpis
        isLoading={isLoading}
        thisMonth={thisMonth}
        total={total}
        pendingTransfer={pendingTransfer}
        transferred={transferred}
      />

      <div className="owner-grid-2">
        <PayoutMethodCard onAddMethod={() => setIsModalOpen(true)} />
        <EarningsChart data={dataEarnings} isLoading={isLoading} />
      </div>

      <PaymentsTable rows={paymentsRows} isLoading={isLoading} />

      <PayoutMethodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Earnings;

Earnings.layout = page => <OwnerLayout>{page}</OwnerLayout>;
