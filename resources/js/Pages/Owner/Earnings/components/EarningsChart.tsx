import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '../../../../components/shared/OwnerSkeletons';

const EarningsChart = ({ data, isLoading }) => {
  if (isLoading) {
    return <ChartSkeleton height={220} />;
  }

  return (
    <div className="owner-card">
      <h4 className="mb-6">الأرباح — آخر 12 شهراً</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} ر.ي`} />
            <Bar dataKey="amount" fill="#2D5A27" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;
