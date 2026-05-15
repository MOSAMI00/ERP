import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LineChart({ chartFilter, setChartFilter, lineData }) {
  return (
    <div className="xl:col-span-8 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-brand-text-primary">عمليات التأجير — آخر 30 يوماً</h3>
        <div className="flex bg-brand-content rounded-lg p-1">
          {['أسبوع', 'شهر', '3 أشهر', 'سنة'].map(tab => (
            <button 
              key={tab}
              onClick={() => setChartFilter(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartFilter === tab ? 'bg-white text-brand-text-primary shadow-sm' : 'text-brand-text-muted hover:text-brand-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsLineChart data={lineData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }}
              itemStyle={{ color: '#222' }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ direction: 'rtl' }} />
            <Line type="monotone" dataKey="completed" name="مكتملة" stroke="#27AE60" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
            <Line type="monotone" dataKey="cancelled" name="ملغاة" stroke="#F39C12" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
