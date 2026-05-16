import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import KpiRow1 from './components/KpiRow1';
import KpiRow2 from './components/KpiRow2';
import LineChart from './components/LineChart';
import DonutChart from './components/DonutChart';
import DisputesTable from './components/DisputesTable';
import ComplaintsTable from './components/ComplaintsTable';

export default function OverviewPage() {
  const { props } = usePage();
  const [chartFilter, setChartFilter] = useState('شهر');
  const lineData = props.lineData ?? [];
  const pieData = props.pieData ?? [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <KpiRow1 stats={props.stats ?? {}} />
      <KpiRow2 lineData={lineData} stats={props.stats ?? {}} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <LineChart chartFilter={chartFilter} setChartFilter={setChartFilter} lineData={lineData} />
        <DonutChart pieData={pieData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DisputesTable disputes={props.recentDisputes ?? []} />
        <ComplaintsTable reports={props.recentReports ?? []} />
      </div>
    </div>
  );
}
