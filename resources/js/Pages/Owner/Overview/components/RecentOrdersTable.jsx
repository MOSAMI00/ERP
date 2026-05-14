import React from 'react';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { formatCurrency } from '../../../../utils/formatters';
import { AppButton, DataTable, StatusBadge } from '../../../../components/shared';

const fallbackEquipment = (rental) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
const fallbackTenant = (rental) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—' };

const RecentOrdersTable = ({ rentals, isLoading }) => {
  const handleApprove = (rental) => {
    if (confirm('هل أنت متأكد من الموافقة على هذا الطلب؟ سيتم توقيع العقد آلياً.')) {
      router.post(`/rentals/${rental.id}/confirm`);
    }
  };

  const handleReject = (rental) => {
    const reason = prompt('يرجى ذكر سبب الرفض:');
    if (reason) {
      router.post(`/rentals/${rental.id}/cancel`, { cancellation_reason: reason });
    }
  };

  const handleView = (rental) => {
    router.visit(`/rentals/${rental.id}`);
  };

  const columns = [
    {
      key: 'order',
      header: '#',
      cell: (rental) => rental.id ?? '—',
    },
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (rental) => {
        const tenant = fallbackTenant(rental);
        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center rounded-full w-8 h-8 bg-muted text-xs font-bold">
              {(tenant.full_name || tenant.name || '?').charAt(0)}
            </div>
            <span className="text-sm font-medium">{tenant.full_name || tenant.name || 'مستخدم غير معروف'}</span>
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
      cell: (rental) => `${rental.start_date || rental.startDate || '—'} - ${rental.end_date || rental.endDate || '—'}`,
    },
    {
      key: 'total',
      header: 'المبلغ',
      cell: (rental) => `${formatCurrency(rental.total_amount || rental.totalAmount || 0)} ر.ي`,
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
          <div className="flex items-center gap-2">
            <AppButton 
              variant="success" 
              size="sm"
              onClick={() => handleApprove(rental)}
            >
              <CheckCircle size={14} /> قبول
            </AppButton>
            <AppButton 
              variant="danger" 
              size="icon"
              onClick={() => handleReject(rental)}
            >
              <XCircle size={14} />
            </AppButton>
          </div>
        ) : (
          <AppButton 
            variant="outline" 
            size="sm"
            onClick={() => handleView(rental)}
          >
            <Eye size={14} /> عرض
          </AppButton>
        )
      ),
    },
  ];

  return (
    <div className="owner-card bg-white p-6 rounded-xl border border-border">
      <div className="flex items-center justify-between mb-6">
        <h4 className="font-bold text-lg">آخر 5 طلبات واردة</h4>
        <button 
          onClick={() => router.visit('/rentals')}
          className="text-primary text-sm font-bold hover:underline"
        >
          عرض الكل
        </button>
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
