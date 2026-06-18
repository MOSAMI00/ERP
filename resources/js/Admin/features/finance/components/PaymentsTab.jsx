import { Calendar, CheckCircle, RotateCcw, StopCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import SearchInput from '../../../components/ui/SearchInput';
import Select from '../../../components/ui/Select';
import Table from '../../../components/ui/Table';

const typeLabels = {
  rental: 'إيجار',
  insurance: 'تأمين',
  insurance_refund: 'استرداد تأمين',
  owner_transfer: 'تحويل للمؤجر',
  compensation: 'تعويض',
};

const statusLabels = {
  pending: 'بانتظار',
  processing: 'قيد المعالجة',
  paid: 'مدفوع',
  failed: 'فشل',
  cancelled: 'ملغي',
  stopped: 'موقوف',
  refunded: 'مسترد',
};

const escrowLabels = {
  held: 'محتجز',
  released: 'مفرج عنه',
  refunded: 'مسترد',
};

export default function PaymentsTab({ payments = [], filters = {} }) {
  const requestFilters = (nextFilters) => {
    router.get(route('admin.payments.index'), nextFilters, {
      preserveState: true,
      replace: true,
    });
  };




  const columns = [
    { key: 'ref', label: 'المرجع' },
    { key: 'type', label: 'نوع الحركة' },
    { key: 'payer', label: 'الدافع' },
    { key: 'rental', label: 'العملية' },
    { key: 'amount', label: 'المبلغ' },
    { key: 'fee', label: 'رسوم المنصة' },
    { key: 'net', label: 'الصافي' },
    { key: 'escrow', label: 'الضمان' },
    { key: 'date', label: 'التاريخ' },
    { key: 'status', label: 'الحالة', className: 'px-6 py-4 text-center' },
  ];

  return (
    <div className="animate-in fade-in duration-300">
      <div className="p-4 border-b border-brand-border bg-white flex flex-wrap gap-4 items-center">
        <SearchInput value={filters.search ?? ''} onChange={(event) => requestFilters({ ...filters, search: event.target.value || undefined })} placeholder="بحث بالمرجع، الدافع، الطرف، أو المعدة..." className="flex-1 min-w-[240px]" inputClassName="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-border bg-brand-content focus:outline-none focus:border-brand-primary text-sm" />
        <div className="flex items-center space-x-2 space-x-reverse border border-brand-border bg-brand-content rounded-lg px-4 py-2 text-sm text-brand-text-muted">
          <Calendar size={16} />
          <span>مرتبة من الأحدث</span>
        </div>
        <Select value={filters.status ?? ''} onChange={(event) => requestFilters({ ...filters, status: event.target.value || undefined })} placeholder="حالة الدفع: الكل" options={[
          { value: 'pending', label: 'بانتظار' },
          { value: 'processing', label: 'قيد المعالجة' },
          { value: 'paid', label: 'مدفوع' },
          { value: 'failed', label: 'فشل' },
          { value: 'stopped', label: 'موقوف' },
          { value: 'refunded', label: 'مسترد' },
        ]} />
        <Select value={filters.type ?? ''} onChange={(event) => requestFilters({ ...filters, type: event.target.value || undefined })} placeholder="نوع الحركة: الكل" options={Object.entries(typeLabels).map(([value, label]) => ({ value, label }))} />
        <Select value={filters.escrow_status ?? ''} onChange={(event) => requestFilters({ ...filters, escrow_status: event.target.value || undefined })} placeholder="حالة الضمان: الكل" options={Object.entries(escrowLabels).map(([value, label]) => ({ value, label }))} />
      </div>
      
      <Table
        columns={columns}
        data={payments}
        renderRow={(payment) => {
          const amount = Number(payment.amount ?? 0);
          const fee = Number(payment.platform_fee ?? 0);
          const net = Math.max(amount - fee, 0);
          const rental = payment.rental ?? {};
          const ref = payment.transaction_ref ?? `PAY-${String(payment.id).padStart(5, '0')}`;

          return (
          <tr key={payment.id} className="hover:bg-brand-content/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-brand-text-primary" dir="ltr">{ref}</div>
                  <div className="text-xs text-brand-text-muted" dir="ltr">#{payment.id}</div>
                </td>
                <td className="px-6 py-4">
                  <Badge unstyled className="px-2.5 py-1 rounded-md text-xs font-bold bg-brand-info/10 text-brand-info">
                    {typeLabels[payment.type] ?? payment.type ?? 'غير محدد'}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{payment.payer?.name ?? '—'}</div>
                  <div className="text-xs text-brand-text-muted">{payment.payer?.email ?? ''}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-brand-text-primary">{rental.equipment?.name ?? '—'}</div>
                  <div className="text-xs text-brand-text-muted">
                    المستأجر: {rental.tenant?.full_name ?? rental.tenant?.name ?? '—'} | المؤجر: {rental.owner?.full_name ?? rental.owner?.name ?? '—'}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-brand-primary">{amount.toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 text-brand-text-muted">{fee.toLocaleString()} ر.ي</td>
                <td className="px-6 py-4 font-medium">{net.toLocaleString()} ر.ي</td>
                <td className="px-6 py-4">
                  {payment.escrow_status ? (
                    <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                      payment.escrow_status === 'held' ? 'bg-brand-warning/10 text-brand-warning' :
                      payment.escrow_status === 'released' ? 'bg-brand-success/10 text-brand-success' :
                      'bg-brand-info/10 text-brand-info'
                    }`}>
                      {escrowLabels[payment.escrow_status] ?? payment.escrow_status}
                    </Badge>
                  ) : '—'}
                </td>
                <td className="px-6 py-4 text-brand-text-muted" dir="ltr">{payment.paid_at ?? payment.created_at ?? ''}</td>
                <td className="px-6 py-4 text-center">
                  <Badge unstyled className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    payment.status === 'paid' ? 'bg-brand-success/10 text-brand-success' :
                    payment.status === 'pending' || payment.status === 'processing' ? 'bg-brand-warning/10 text-brand-warning' :
                    'bg-brand-danger/10 text-brand-danger'
                  }`}>{statusLabels[payment.status] ?? payment.status}</Badge>
                </td>
              </tr>
        )}}
      />
    </div>
  );
}
