import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

export default function ComplaintsTable() {
  const rows = [1, 2, 3];
  const columns = [
    { key: 'id', label: '#', className: 'py-3 px-4 rounded-r-lg' },
    { key: 'reporter', label: 'المُبلِّغ', className: 'py-3 px-4' },
    { key: 'type', label: 'نوع البلاغ', className: 'py-3 px-4' },
    { key: 'date', label: 'التاريخ', className: 'py-3 px-4' },
    { key: 'action', label: 'إجراء', className: 'py-3 px-4 rounded-l-lg text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-brand-text-primary">آخر البلاغات</h3>
        <button className="text-brand-info text-sm font-medium hover:underline">عرض الكل</button>
      </div>
      <Table
        columns={columns}
        data={rows}
        theadClassName="bg-brand-content text-brand-text-muted font-medium"
        renderRow={(i) => (
          <tr key={i} className="hover:bg-brand-content/50 transition-colors">
                <td className="py-3 px-4 text-brand-text-muted">#R-80{i}</td>
                <td className="py-3 px-4 font-medium">ياسر علي</td>
                <td className="py-3 px-4">
                  <Badge unstyled className="px-2 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-xs font-bold">سلوك مسيء</Badge>
                </td>
                <td className="py-3 px-4 text-brand-text-muted">منذ ساعتين</td>
                <td className="py-3 px-4 text-center">
                  <Button unstyled className="border border-brand-primary text-brand-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary/10 transition-colors inline-flex items-center">
                    معالجة
                  </Button>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
