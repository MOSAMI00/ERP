import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';

export default function ChartsRow1({ govData, profitData, formatCurrency }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-6 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm">
        <h3 className="text-lg font-bold text-brand-text-primary mb-6">عمليات التأجير حسب المحافظة</h3>
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={govData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <Tooltip cursor={{fill: '#F4F6F9'}} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }} />
              <Bar dataKey="value" name="عدد العمليات" fill="#2D5A27" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lg:col-span-6 bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm">
        <h3 className="text-lg font-bold text-brand-text-primary mb-6">الأرباح الإجمالية بالزمن</h3>
        <div className="h-72 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={profitData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#27AE60" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#27AE60" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} tick={{fill: '#888888', fontSize: 12}} />
              <Tooltip formatter={(value) => value.toLocaleString() + ' ر.ي'} contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #E0E0E0', direction: 'rtl' }} />
              <Area type="monotone" dataKey="value" name="الأرباح" stroke="#27AE60" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
