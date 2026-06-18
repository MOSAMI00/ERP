import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import React, { useEffect, useState } from 'react';
import OverviewKpis from './components/OverviewKpis';
import EarningsChart from './components/EarningsChart';
import OrderStatusChart from './components/OrderStatusChart';
import RecentOrdersTable from './components/RecentOrdersTable';
import { useOwnerOverview } from './useOwnerOverview';

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const overview = useOwnerOverview();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div>
      <OverviewKpis
        isLoading={isLoading}
        activeOrders={overview.activeOrders}
        monthEarnings={overview.monthEarnings}
        monthGrowth={overview.monthGrowth}
        equipmentCount={overview.equipmentCount}
        averageRating={overview.averageRating}
        reviewsCount={overview.reviewsCount}
      />

      <div className="owner-grid-2">
        <EarningsChart data={overview.dataEarnings} isLoading={isLoading} />
        <OrderStatusChart data={overview.dataOrders} isLoading={isLoading} />
      </div>

      <RecentOrdersTable rentals={overview.recentRentals} isLoading={isLoading} />
    </div>
  );
};

export default Overview;



Overview.layout = page => <OwnerLayout>{page}</OwnerLayout>;
