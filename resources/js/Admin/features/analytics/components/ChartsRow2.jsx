import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, PieChart, Pie, Cell 
} from 'recharts';

export default function ChartsRow2({ compareData, topOwnersData, gaugeData, disputeRate }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-brand-text-primary mb-6">معدل الإلغاء vs الإكمال</h3>
        <div className="flex-1 min-h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <Tooltip cursor={{fill: '#F4F6F9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }} />
              <Legend wrapperStyle={{ fontSize: '12px', direction: 'rtl' }} />
              <Bar dataKey="completed" name="مكتملة" fill="#27AE60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cancelled" name="ملغاة" fill="#E74C3C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-4 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col">
        <h3 className="text-lg font-bold text-brand-text-primary mb-6">أفضل المؤجرين أداءً</h3>
        <div className="flex-1 min-h-[250px] w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={topOwnersData} margin={{ top: 5, right: 0, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E0E0E0" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#222', fontSize: 12, fontWeight: 'bold'}} width={80} />
              <Tooltip cursor={{fill: '#F4F6F9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }} />
              <Bar dataKey="value" name="عدد العمليات" fill="#3498DB" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-4 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-center items-center relative">
        <h3 className="text-lg font-bold text-brand-text-primary mb-2 w-full text-right">معدل النزاعات الإجمالي</h3>
        <div className="flex-1 flex flex-col items-center justify-center w-full mt-4" dir="ltr">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={gaugeData}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {gaugeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute bottom-10 flex flex-col items-center">
            <span className={`text-4xl font-bold ${disputeRate > 5 ? 'text-brand-danger' : 'text-brand-success'}`}>
              {disputeRate}%
            </span>
            <span className="text-sm font-bold text-brand-text-muted mt-1">الهدف: &lt; 5%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
