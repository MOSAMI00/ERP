import Table from '../../../components/ui/Table';

export default function KpisTable() {
  const rows = [
    ['معدل إكمال العمليات', '87%', '90%', '-3%', '🟡', 'text-brand-text-primary', 'text-brand-warning'],
    ['معدل النزاعات', '3.2%', '< 5%', '✅', '🟢', 'text-brand-success', 'text-brand-success'],
    ['معدل الإلغاء', '8%', '< 10%', '✅', '🟢', 'text-brand-success', 'text-brand-success'],
    ['متوسط تقييم المؤجرين', '4.5 / 5', '> 4.0', '✅', '🟢', 'text-brand-success', 'text-brand-success'],
  ];
  const columns = [
    { key: 'metric', label: 'المؤشر' },
    { key: 'current', label: 'القيمة الحالية', className: 'px-6 py-4 text-center' },
    { key: 'target', label: 'الهدف', className: 'px-6 py-4 text-center' },
    { key: 'diff', label: 'الفارق', className: 'px-6 py-4 text-center' },
    { key: 'rating', label: 'التقييم', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl shadow-sm border border-brand-border overflow-hidden">
      <div className="p-4 border-b border-brand-border bg-brand-content/30">
        <h3 className="text-lg font-bold text-brand-text-primary">جدول المؤشرات الرئيسية (KPIs)</h3>
      </div>
      <Table
        columns={columns}
        data={rows}
        tbodyClassName="divide-y divide-brand-border font-bold"
        renderRow={([metric, current, target, diff, rating, currentClass, diffClass]) => (
          <tr key={metric} className="hover:bg-brand-content/50 transition-colors">
            <td className="px-6 py-4">{metric}</td>
            <td className={`px-6 py-4 text-center ${currentClass}`}>{current}</td>
            <td className="px-6 py-4 text-center text-brand-text-muted">{target}</td>
            <td className={`px-6 py-4 text-center ${diffClass}`}>{diff}</td>
            <td className="px-6 py-4 text-center text-lg">{rating}</td>
          </tr>
        )}
      />
    </div>
  );
}
