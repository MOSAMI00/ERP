import React from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { DataTable, StatusBadge } from '../../../../components/shared';

const escrowStatusMeta = {
  released: { label: 'مدفوع', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  held: { label: 'قيد المعالجة', color: '#F39C12', bg: 'rgba(243,156,18,0.12)' },
  pending: { label: 'بانتظار', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
};

const PaymentsTable = ({ rows, isLoading }) => {
  const columns = [
    {
      key: 'order',
      header: 'الطلب',
      cell: (rental) => rental.orderNum ?? '—',
    },
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (rental) => rental.tenant?.name ?? 'مستخدم غير معروف',
    },
    {
      key: 'rentalAmount',
      header: 'مبلغ الإيجار',
      cell: (rental) => `${formatCurrency(rental.rentalAmount)} ر.ي`,
    },
    {
      key: 'fee',
      header: 'عمولة المنصة',
      className: 'text-muted',
      cell: (rental) => `${formatCurrency(Math.round(rental.rentalAmount * 0.05))} ر.ي`,
    },
    {
      key: 'net',
      header: 'صافي الأرباح',
      cell: (rental) => {
        const fee = Math.round(rental.rentalAmount * 0.05);
        return <span style={{ fontWeight: 700 }}>{formatCurrency(rental.rentalAmount - fee)} ر.ي</span>;
      },
    },
    {
      key: 'status',
      header: 'حالة التحويل',
      cell: (rental) => {
        const status = rental.escrowStatus ?? 'pending';
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
