import Badge from '../../../components/ui/Badge';
import Table from '../../../components/ui/Table';

export default function EscrowTab({ payments = [], summary = {} }) {
  const rows = payments.filter((payment) => payment.escrow_status === 'held');
  const columns = [
    { key: 'op', label: 'عملية' },
    { key: 'amount', label: 'مبلغ محتجز' },
    { key: 'since', label: 'منذ' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="p-6 border-b border-brand-border bg-brand-content/30 flex justify-between items-center">
        <div>
          <p className="text-brand-text-muted text-sm mb-1">إجمالي المحتجز</p>
          <p className="text-2xl font-bold text-brand-warning">{Number(summary.total_pending ?? 0).toLocaleString()} ر.ي</p>
        </div>
        <div className="text-left">
          <p className="text-brand-text-muted text-sm mb-1">عدد العمليات المفتوحة</p>
          <p className="text-2xl font-bold text-brand-text-primary">{rows.length}</p>
        </div>
      </div>
      <Table
        columns={columns}
        data={rows}
        renderRow={(payment) => (
          <tr key={payment.id} className="hover:bg-brand-content/50 transition-colors">
            <td className="px-6 py-4 font-bold" dir="ltr">OP-{payment.rental?.id ?? payment.id}</td>
            <td className="px-6 py-4 font-bold text-brand-warning">{Number(payment.amount ?? 0).toLocaleString()} ر.ي</td>
            <td className="px-6 py-4 text-brand-text-muted">{String(payment.created_at ?? '').slice(0, 10)}</td>
            <td className="px-6 py-4 text-center">
              <Badge unstyled className="px-2.5 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-xs font-bold">{payment.rental?.status ?? payment.status}</Badge>
            </td>
          </tr>
        )}
      />
    </div>
  );
}
