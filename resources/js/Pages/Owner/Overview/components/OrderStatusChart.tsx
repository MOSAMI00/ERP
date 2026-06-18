import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { EmptyState } from '../../../../components/shared';
import { ChartSkeleton } from '../../../../components/shared/OwnerSkeletons';

const dataOrdersLabels = {
  pending: 'بانتظار',
  confirmed: 'مؤكد',
  in_use: 'قيد الاستخدام',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  disputed: 'نزاع',
};

const OrderStatusChart = ({ data, isLoading }) => {
  if (isLoading) {
    return <ChartSkeleton height={220} />;
  }

  return (
    <div className="owner-card">
      <h4 className="mb-6">توزيع حالات الطلبات</h4>
      {data.length === 0 ? (
        <EmptyState compact type="empty" title="لا توجد طلبات لعرضها" />
      ) : (
        <>
          <div style={{ width: '100%', height: 220, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={data} innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} طلب`, dataOrdersLabels[name] || name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-center gap-4 mt-2 w-full" style={{ flexWrap: 'wrap' }}>
            {data.map((item) => (
              <div key={item.name} className="flex-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                <span className="text-muted" style={{ fontSize: 12 }}>{dataOrdersLabels[item.name] ?? item.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderStatusChart;
