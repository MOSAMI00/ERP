import { Calendar, StopCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';

export default function PaymentsTab({ payments = [], filters = {} }) {
  const requestFilters = (nextFilters) => {
    router.get(route('admin.payments.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };

  const columns = [
    { key: 'id', label: '#' },
    { key: 'tenant', label: 'المستأجر' },
    { key: 'eq', label: 'المعدة' },
    { key: 'rent', label: 'مبلغ الإيجار' },
    { key: 'insurance', label: 'مبلغ التأمين' },
    { key: 'date', label: 'تاريخ الدفع' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
    { key: 'action', label: 'إجراء', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="p-4 border-b border-brand-border bg-white flex flex-wrap gap-4 items-center">
        <SearchInput value={filters.search ?? ''} onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })} placeholder="بحث..." className="flex-1 min-w-[200px]" inputClassName="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-border bg-brand-content focus:outline-none focus:border-brand-primary text-sm" />
        <div className="flex items-center space-x-2 space-x-reverse border border-brand-border bg-brand-content rounded-lg px-4 py-2 text-sm text-brand-text-muted cursor-pointer hover:border-brand-primary transition-colors">
          <Calendar size={16} />
          <span>تاريخ الدفع</span>
        </div>
        <Select value={filters.status ?? ''} onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })} placeholder="حالة الدفع: الكل" options={[{ value: 'paid', label: 'مكتمل' }, { value: 'pending', label: 'معلق' }]} />
      </div>
      
      <Table
        columns={columns}
        data={payments}
        renderRow={(payment) => (
          <tr key={payment.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4 font-bold" dir="ltr">{payment.transaction_ref ?? payment.id}</td>
                <td className="px-6 py-4 font-medium">{payment.payer?.name}</td>
                <td className="px-6 py-4 text-brand-text-muted">{payment.rental?.equipment?.name}</td>
                <td className="px-6 py-4 font-bold text-brand-primary">{Number(payment.amount ?? 0).toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 font-medium">{Number(payment.rental?.insurance_amount ?? 0).toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 text-brand-text-muted" dir="ltr">{payment.created_at ?? ''}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className="px-2.5 py-1 bg-brand-success/10 text-brand-success rounded-md text-xs font-bold">{payment.status}</Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <Button unstyled onClick={() => router.post(route('admin.payments.reject', payment.id), { rejection_reason: 'Rejected by admin.' }, { preserveScroll: true })} className="text-brand-danger hover:bg-brand-danger/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center">
                    <StopCircle size={14} className="ml-1" /> إيقاف/مراجعة
                  </Button>
                </td>
              </tr>
        )}
      />
    </div>
  );
}
