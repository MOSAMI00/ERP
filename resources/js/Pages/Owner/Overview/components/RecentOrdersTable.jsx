import React from 'react';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import { AppButton, DataTable, StatusBadge } from '../../../../components/shared';

const fallbackEquipment = (rental) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
const fallbackTenant = (rental) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—' };

const RecentOrdersTable = ({ rentals, isLoading }) => {
  const columns = [
    {
      key: 'order',
      header: '#',
      cell: (rental) => rental.orderNum ?? '—',
    },
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (rental) => {
        const tenant = fallbackTenant(rental);
        return (
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            {tenant.avatarUrl ? (
              <img src={tenant.avatarUrl} alt={tenant.name ?? ''} style={{ borderRadius: '50%', width: 28, height: 28 }} />
            ) : (
              <div className="flex-center" style={{ borderRadius: '50%', width: 28, height: 28, backgroundColor: 'var(--color-page-bg)', fontSize: 12 }}>
                {(tenant.name ?? '?').charAt(0)}
              </div>
            )}
            {tenant.name ?? 'مستخدم غير معروف'}
          </div>
        );
      },
    },
    {
      key: 'equipment',
      header: 'المعدة',
      cell: (rental) => fallbackEquipment(rental).name ?? 'معدة غير معروفة',
    },
    {
      key: 'period',
      header: 'الفترة',
      cell: (rental) => `${rental.startDate ?? '—'} - ${rental.endDate ?? '—'}`,
    },
    {
      key: 'total',
      header: 'المبلغ',
      cell: (rental) => `${formatCurrency(rental.totalAmount ?? 0)} ر.ي`,
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (rental) => <StatusBadge status={rental.status} />,
    },
    {
      key: 'actions',
      header: 'الإجراء',
      cell: (rental) => (
        rental.status === 'pending' ? (
          <div className="flex-center gap-2">
            <AppButton variant="success" size="sm"><CheckCircle size={14} /> قبول</AppButton>
            <AppButton variant="danger" size="icon"><XCircle size={14} /></AppButton>
          </div>
        ) : (
          <AppButton variant="outline" size="sm"><Eye size={14} /> عرض</AppButton>
        )
      ),
    },
  ];

  return (
    <div className="owner-card">
      <div className="flex-between mb-6">
        <h4 style={{ margin: 0 }}>آخر 5 طلبات واردة</h4>
        <button className="owner-btn owner-btn-outline" style={{ fontSize: 13 }}>عرض الكل</button>
      </div>
      <DataTable
        columns={columns}
        data={rentals}
        getRowKey={(rental) => rental.id}
        loading={isLoading}
        loadingLabel="جاري تحميل الطلبات..."
        emptyState={{
          icon: '📄',
          title: 'لا توجد طلبات حتى الآن',
        }}
      />
    </div>
  );
};

export default RecentOrdersTable;
