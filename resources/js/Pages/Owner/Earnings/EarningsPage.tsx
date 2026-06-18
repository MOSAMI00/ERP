import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useMemo, useState } from 'react';

import { PageHeader } from '../../../components/shared';
import EarningsKpis from './components/EarningsKpis';
import EarningsChart from './components/EarningsChart';
import PayoutMethodCard from './PayoutMethodCard';
import PaymentsTable from './components/PaymentsTable';
import PayoutMethodModal from './PayoutMethodModal';

const Earnings = ({ payments: propPayments, payment_methods: propMethods, auth }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const paymentMethods = propMethods ?? [];
  const payments = propPayments ?? [];

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const paymentValue = (payment, key, fallback = null) => payment?.[key] ?? payment?.[key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())] ?? fallback;
  const enumValue = (value) => (typeof value === 'object' ? value?.value : value);
  const earningPayments = useMemo(
    () => payments.filter((payment) => ['owner_transfer', 'compensation'].includes(enumValue(paymentValue(payment, 'type')))),
    [payments],
  );
  const pendingRentalPayments = useMemo(
    () => payments.filter((payment) => enumValue(paymentValue(payment, 'type')) === 'rental' && enumValue(paymentValue(payment, 'status')) === 'paid' && enumValue(paymentValue(payment, 'escrow_status')) === 'held'),
    [payments],
  );

  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = earningPayments
        .filter((payment) => {
          const created = new Date(paymentValue(payment, 'transferred_at') ?? paymentValue(payment, 'created_at'));
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, payment) => total + Number(paymentValue(payment, 'amount', 0)), 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [earningPayments]);

  const thisMonth = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const transferred = earningPayments.reduce((sum, payment) => sum + Number(paymentValue(payment, 'amount', 0)), 0);
  const pendingTransfer = pendingRentalPayments.reduce((sum, payment) => {
    const rental = payment.rental ?? {};
    const rentalAmount = Number(rental.rental_amount ?? rental.rentalAmount ?? 0);
    const fee = Number(paymentValue(payment, 'platform_fee', 0));
    return sum + Math.max(0, rentalAmount - fee);
  }, 0);
  const total = transferred + pendingTransfer;
  const paymentsRows = payments
    .slice()
    .sort((a, b) => new Date(paymentValue(b, 'created_at')).getTime() - new Date(paymentValue(a, 'created_at')).getTime())
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
        <PayoutMethodCard 
          methods={paymentMethods}
          onAddMethod={() => setIsModalOpen(true)} 
        />
        <EarningsChart data={dataEarnings} isLoading={isLoading} />
      </div>

      <PaymentsTable rows={paymentsRows} isLoading={isLoading} />

      <PayoutMethodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Earnings;

Earnings.layout = page => <OwnerLayout>{page}</OwnerLayout>;
