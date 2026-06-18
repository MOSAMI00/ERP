import { MessageSquare } from 'lucide-react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';

export default function ComplaintsTable({ onOpenModal }) {
  const rows = [1, 2, 3, 4];
  const columns = [
    { key: 'id', label: '#' },
    { key: 'reporter', label: 'المُبلِّغ' },
    { key: 'type', label: 'نوع البلاغ' },
    { key: 'target', label: 'الهدف' },
    { key: 'date', label: 'التاريخ' },
    { key: 'priority', label: 'أولوية', className: 'px-6 py-4 text-center' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'action', label: 'إجراء', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="p-4 border-b border-brand-border bg-white flex flex-wrap gap-4 items-center">
        <SearchInput placeholder="بحث..." className="flex-1 min-w-[200px]" inputClassName="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-border bg-brand-content focus:outline-none focus:border-brand-primary text-sm" />
        <Select placeholder="أولوية: الكل" options={[{ value: 'high', label: '🔴 عالية' }, { value: 'normal', label: '⚪ عادية' }]} />
      </div>
      
      <Table
        columns={columns}
        data={rows}
        renderRow={(i) => (
          <tr key={i} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold text-brand-text-muted" dir="ltr">RPT-00{i}</td>
                <td className="px-6 py-4 font-bold text-brand-text-primary">ياسر علي</td>
                <td className="px-6 py-4">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-info/10 text-brand-info rounded-md text-xs font-bold">مستخدم</Badge>
                </td>
                <td className="px-6 py-4 font-medium">أحمد محمد</td>
                <td className="px-6 py-4 text-brand-text-muted">منذ ساعتين</td>
                <td className="px-6 py-4 text-center">
                  {i === 1 ? <span className="text-brand-danger font-bold text-xs">🔴 عالية</span> : <span className="text-brand-text-muted text-xs">عادية</span>}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-warning/10 text-brand-warning rounded-md text-xs font-bold">جديد</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button unstyled onClick={onOpenModal} className="border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center">
                    <MessageSquare size={14} className="ml-1" /> معالجة
                  </Button>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
