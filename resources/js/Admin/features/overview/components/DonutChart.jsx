import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function DonutChart({ pieData }) {
  return (
    <div className="xl:col-span-4 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col">
      <h3 className="text-lg font-bold text-brand-text-primary mb-6">توزيع حالات الطلبات</h3>
      <div className="flex-1 min-h-[300px]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }}
              itemStyle={{ color: '#222' }}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px', direction: 'rtl' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
