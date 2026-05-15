import { useState } from 'react';
import KpiRow1 from './components/KpiRow1';
import KpiRow2 from './components/KpiRow2';
import LineChart from './components/LineChart';
import DonutChart from './components/DonutChart';
import DisputesTable from './components/DisputesTable';
import ComplaintsTable from './components/ComplaintsTable';
import { lineData, pieData } from '../../data/overview';

export default function OverviewPage() {
  const [chartFilter, setChartFilter] = useState('شهر');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <KpiRow1 />
      <KpiRow2 lineData={lineData} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <LineChart chartFilter={chartFilter} setChartFilter={setChartFilter} lineData={lineData} />
        <DonutChart pieData={pieData} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DisputesTable />
        <ComplaintsTable />
      </div>
    </div>
  );
}
