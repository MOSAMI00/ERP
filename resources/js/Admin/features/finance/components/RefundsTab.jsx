import Badge from '../../../components/ui/Badge';
import Table from '../../../components/ui/Table';

export default function RefundsTab({ payments = [] }) {
  const rows = payments.filter((payment) => payment.type === 'insurance_refund' || payment.status === 'refunded');
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
        renderRow={(payment) => (
          <tr key={payment.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-primary">{payment.payer?.name ?? payment.rental?.tenant?.full_name ?? '—'}</td>
                <td className="px-6 py-4 font-medium text-brand-text-muted">{Number(payment.rental?.insurance_amount ?? payment.amount ?? 0).toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 font-bold text-brand-success">{Number(payment.amount ?? 0).toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 text-brand-text-muted" dir="ltr">{String(payment.refunded_at ?? payment.created_at ?? '').slice(0, 10)}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-success/10 text-brand-success rounded-md text-xs font-bold">تم الاسترداد</Badge>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
