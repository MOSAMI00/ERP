import Badge from '../../../components/ui/Badge';
import Table from '../../../components/ui/Table';

export default function ProfitsTab() {
  const rows = [1, 2, 3];
  const columns = [
    { key: 'owner', label: 'المؤجر' },
    { key: 'count', label: 'عدد العمليات', className: 'px-6 py-4 text-center' },
    { key: 'profits', label: 'إجمالي الأرباح' },
    { key: 'status', label: 'حالة التحويل', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <Table
        columns={columns}
        data={rows}
        renderRow={(i) => (
          <tr key={i} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary">مؤسسة التقنية</td>
                <td className="px-6 py-4 text-center font-medium">12</td>
                <td className="px-6 py-4 font-bold text-brand-success">450,000 ر.ي</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-info/10 text-brand-info rounded-md text-xs font-bold">Processing</Badge>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
