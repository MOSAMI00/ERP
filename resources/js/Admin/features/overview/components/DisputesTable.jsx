import { Eye } from 'lucide-react';
import { Link } from '@inertiajs/react';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

export default function DisputesTable({ disputes = [] }) {
  const columns = [
    { key: 'id', label: '#', className: 'py-3 px-4 rounded-r-lg' },
    { key: 'tenant', label: 'المستأجر', className: 'py-3 px-4' },
    { key: 'owner', label: 'المؤجر', className: 'py-3 px-4' },
    { key: 'eq', label: 'المعدة', className: 'py-3 px-4' },
    { key: 'amount', label: 'المبلغ', className: 'py-3 px-4' },
    { key: 'action', label: 'إجراء', className: 'py-3 px-4 rounded-l-lg text-center' },
  ];

  return (
    <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-brand-text-primary">آخر النزاعات</h3>
        <button className="text-brand-info text-sm font-medium hover:underline">عرض الكل</button>
      </div>
      <Table
        columns={columns}
        data={disputes}
        theadClassName="bg-brand-content text-brand-text-muted font-medium"
        renderRow={(dispute) => (
          <tr key={dispute.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="py-3 px-4 text-brand-text-muted">#D-{dispute.id}</td>
                <td className="py-3 px-4 font-medium">{dispute.rental?.tenant?.full_name ?? '—'}</td>
                <td className="py-3 px-4 font-medium">{dispute.rental?.owner?.full_name ?? '—'}</td>
                <td className="py-3 px-4">{dispute.rental?.equipment?.name ?? '—'}</td>
                <td className="py-3 px-4 font-bold text-brand-danger">{Number(dispute.requested_compensation ?? dispute.final_compensation ?? 0).toLocaleString()} ر.ي</td>
                <td className="py-3 px-4 text-center">
                  <Link href={route('admin.disputes.index')}>
                  <Button unstyled className="bg-brand-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand-primary/90 transition-colors inline-flex items-center">
                    <Eye size={14} className="ml-1"/> مراجعة
                  </Button>
                  </Link>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
