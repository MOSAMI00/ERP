import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { DataTable, StatusBadge } from '../../../../components/shared';

const escrowStatusMeta = {
  released: { label: 'مدفوع', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  held: { label: 'قيد المعالجة', color: '#F39C12', bg: 'rgba(243,156,18,0.12)' },
  pending: { label: 'بانتظار', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
};

const enumValue = (value) => (typeof value === 'object' ? value?.value : value);
const paymentTypeLabels = {
  rental: 'إيجار في الضمان',
  owner_transfer: 'تحويل أرباح',
  compensation: 'تعويض',
  insurance_refund: 'استرداد تأمين',
};

const PaymentsTable = ({ rows, isLoading }) => {
  const columns = [
    {
      key: 'order',
      header: 'الطلب',
      cell: (payment) => `#${payment.rental_op_id ?? payment.rentalOpId ?? payment.rental?.id ?? '—'}`,
    },
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (payment) => payment.rental?.tenant?.full_name ?? payment.rental?.tenant?.name ?? 'مستخدم غير معروف',
    },
    {
      key: 'type',
      header: 'نوع العملية',
      cell: (payment) => paymentTypeLabels[enumValue(payment.type)] ?? enumValue(payment.type) ?? '—',
    },
    {
      key: 'amount',
      header: 'المبلغ',
      cell: (payment) => `${formatCurrency(payment.amount ?? 0)} ر.ي`,
    },
    {
      key: 'fee',
      header: 'عمولة المنصة',
      className: 'text-muted',
      cell: (payment) => `${formatCurrency(payment.platform_fee ?? 0)} ر.ي`,
    },
    {
      key: 'net',
      header: 'صافي الأرباح',
      cell: (payment) => {
        const type = enumValue(payment.type);
        const rentalAmount = Number(payment.rental?.rental_amount ?? 0);
        const net = type === 'rental'
          ? Math.max(0, rentalAmount - Number(payment.platform_fee ?? 0))
          : Number(payment.amount ?? 0);
        return <span style={{ fontWeight: 700 }}>{formatCurrency(net)} ر.ي</span>;
      },
    },
    {
      key: 'status',
      header: 'حالة التحويل',
      cell: (payment) => {
        const status = enumValue(payment.escrow_status) ?? 'pending';
        return <StatusBadge status={status} meta={escrowStatusMeta[status]} />;
      },
    },
  ];

  return (
    <div className="owner-card">
      <div className="flex-between mb-6">
        <h4 style={{ margin: 0 }}>سجل المدفوعات</h4>
        <button className="owner-btn owner-btn-outline" type="button"><Download size={16} /> تحميل كشف</button>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(rental) => rental.id}
        loading={isLoading}
        loadingLabel="جاري تحميل السجل..."
        emptyState={{
          icon: '💳',
          title: 'لا توجد مدفوعات حتى الآن',
        }}
      />
    </div>
  );
};

export default PaymentsTable;
