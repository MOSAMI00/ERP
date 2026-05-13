import React from 'react';
import { ClipboardList, DollarSign, Wrench, Star } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import KPICard from '../../../../components/shared/KPICard';
import { KPICardSkeleton } from '../../../../components/shared/OwnerSkeletons';

const OverviewKpis = ({
  isLoading,
  activeOrders,
  monthEarnings,
  monthGrowth,
  equipmentCount,
  averageRating,
  reviewsCount,
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
          title="الطلبات النشطة"
          value={`${activeOrders} طلبات`}
          sub={<span className="text-success">هذا الأسبوع</span>}
          icon={<ClipboardList />}
          iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
        />
        <KPICard
          title="الأرباح هذا الشهر"
          value={`${formatCurrency(monthEarnings)} ر.ي`}
          sub={<span><span className="text-success">{monthGrowth >= 0 ? `+${monthGrowth}%` : `${monthGrowth}%`}</span> مقارنة بالشهر الماضي</span>}
          icon={<DollarSign />}
          iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
        />
        <KPICard
          title="المعدات المتاحة"
          value={`${equipmentCount} / ${equipmentCount}`}
          sub={<span className="badge badge-available" style={{ fontSize: 11 }}>{equipmentCount} متاحة</span>}
          icon={<Wrench />}
        />
        <KPICard
          title="متوسط التقييم"
          value={`${averageRating} / 5`}
          sub={`${reviewsCount} تقييم`}
          icon={<Star />}
          iconStyle={{ color: '#F39C12', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
        />
      </>
    )}
  </div>
);

export default OverviewKpis;
