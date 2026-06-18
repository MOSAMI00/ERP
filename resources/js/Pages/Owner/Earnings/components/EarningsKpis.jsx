import React from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import KPICard from '../../../../components/shared/KPICard';
import { KPICardSkeleton } from '../../../../components/shared/OwnerSkeletons';

const EarningsKpis = ({
  isLoading,
  thisMonth,
  total,
  pendingTransfer,
  transferred,
}) => (
  <div className="owner-grid-4">
    {isLoading ? (
      <>
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </>
    ) : (
      <>
        <KPICard
          title="هذا الشهر"
          value={`${formatCurrency(thisMonth)} ر.ي`}
          icon={<DollarSign />}
          iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
        />
        <KPICard
          title="الإجمالي"
          value={`${formatCurrency(total)} ر.ي`}
          icon={<TrendingUp />}
          iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
        />
        <KPICard
          title="قيد التحويل"
          value={`${formatCurrency(pendingTransfer)} ر.ي`}
          valueClassName="text-warning"
          icon={<DollarSign />}
          iconStyle={{ color: 'var(--color-pending)', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
        />
        <KPICard
          title="محوّل"
          value={`${formatCurrency(transferred)} ر.ي`}
          valueClassName="text-success"
          icon={<DollarSign />}
          iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
        />
      </>
    )}
  </div>
);

export default EarningsKpis;
