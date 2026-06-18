import Badge from '../../../components/ui/Badge';
import Table from '../../../components/ui/Table';

export default function ProfitsTab({ payments = [] }) {
  const rows = payments.filter((payment) => payment.type === 'owner_transfer');
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
        renderRow={(payment) => (
          <tr key={payment.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary">{payment.rental?.owner?.full_name ?? '—'}</td>
                <td className="px-6 py-4 text-center font-medium">{payment.rental?.id ?? '—'}</td>
                <td className="px-6 py-4 font-bold text-brand-success">{Number(payment.amount ?? 0).toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-info/10 text-brand-info rounded-md text-xs font-bold">{payment.status}</Badge>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
