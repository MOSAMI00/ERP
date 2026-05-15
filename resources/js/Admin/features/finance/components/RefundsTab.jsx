import Badge from '../../../components/ui/Badge';
import Table from '../../../components/ui/Table';

export default function RefundsTab() {
  const rows = [1, 2, 3];
  const columns = [
    { key: 'tenant', label: 'المستأجر' },
    { key: 'insurance', label: 'مبلغ التأمين الأصلي' },
    { key: 'refund', label: 'المبلغ المُسترَد' },
    { key: 'date', label: 'تاريخ الاسترداد' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <Table
        columns={columns}
        data={rows}
        renderRow={(i) => (
          <tr key={i} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary">أحمد محمد</td>
                <td className="px-6 py-4 font-medium text-brand-text-muted">100,000 ر.ي</td>
                <td className="px-6 py-4 font-bold text-brand-success">100,000 ر.ي</td>
                <td className="px-6 py-4 text-brand-text-muted" dir="ltr">2024-05-1{i}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-success/10 text-brand-success rounded-md text-xs font-bold">تم الاسترداد</Badge>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
