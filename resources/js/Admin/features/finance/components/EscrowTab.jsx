import { PauseCircle } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Table from '../../../components/ui/Table';

export default function EscrowTab() {
  const rows = [1, 2, 3];
  const columns = [
    { key: 'op', label: 'عملية' },
    { key: 'amount', label: 'مبلغ محتجز' },
    { key: 'since', label: 'منذ' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'action', label: 'إجراء', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="p-6 border-b border-brand-border bg-brand-content/30 flex justify-between items-center">
        <div>
          <p className="text-brand-text-muted text-sm mb-1">إجمالي المحتجز</p>
          <p className="text-2xl font-bold text-brand-warning">2,450,000 ر.ي</p>
        </div>
        <div className="text-left">
          <p className="text-brand-text-muted text-sm mb-1">عدد العمليات المفتوحة</p>
          <p className="text-2xl font-bold text-brand-text-primary">34</p>
        </div>
      </div>
      <Table
        columns={columns}
        data={rows}
        renderRow={(i) => (
          <tr key={i} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold" dir="ltr">OP-2024-08{i}</td>
                <td className="px-6 py-4 font-bold text-brand-warning">150,000 ر.ي</td>
                <td className="px-6 py-4 text-brand-text-muted">12 مايو 2024</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-xs font-bold">In Use</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button unstyled className="text-brand-danger border border-brand-danger hover:bg-brand-danger/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center">
                    <PauseCircle size={14} className="ml-1" /> تعليق الأموال
                  </Button>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
