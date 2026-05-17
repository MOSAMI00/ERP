import React, { useMemo } from 'react';
import { Eye, XCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
import { AppButton, DataTable, DateRangeText, MoneyText, StatusBadge } from '../../../../components/shared';
import { fallbackEquipment, fallbackTenant } from '../rentalHelpers';

const RentalsTable = ({
  rentals,
  isLoading,
  selectedRentalId,
  onToggleRental,
}) => {
  const columns = useMemo(() => [
    {
      key: 'order',
      header: '#',
      cell: (rental) => rental.order_num ?? rental.orderNum ?? `#${rental.id}`,
    },
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (rental) => fallbackTenant(rental).name ?? 'مستخدم غير معروف',
    },
    {
      key: 'equipment',
      header: 'المعدة',
      cell: (rental) => fallbackEquipment(rental).name ?? 'معدة غير معروفة',
    },
    {
      key: 'period',
      header: 'الفترة',
      cell: (rental) => <DateRangeText start={rental.start_date ?? rental.startDate} end={rental.end_date ?? rental.endDate} className="text-xs" />,
    },
    {
      key: 'total',
      header: 'الإجمالي',
      cell: (rental) => <MoneyText value={rental.total_amount ?? rental.totalAmount} />,
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (rental) => <StatusBadge status={rental.status} />,
    },
    {
      key: 'actions',
      header: 'إجراء',
      cell: (rental) => {
        const isPaid = ['paid', 'in_use', 'completed', 'disputed'].includes(rental.status)
          || rental.payments?.some?.((payment) => (typeof payment.status === 'object' ? payment.status?.value : payment.status) === 'paid');
        const canCancel = ['pending', 'confirmed'].includes(rental.status) && !isPaid;

        return (
          <div className="flex flex-wrap gap-2">
            <AppButton
              variant="outline"
              size="sm"
              onClick={() => onToggleRental(rental.id)}
            >
              <Eye size={14} /> عرض
            </AppButton>
            {canCancel ? (
              <AppButton
                variant="danger"
                size="sm"
                onClick={() => {
                  if (!confirm('هل أنت متأكد من إلغاء العملية؟')) return;
                  router.post(`/rentals/${rental.id}/cancel`, {
                    cancellation_reason: 'ألغى المؤجر العملية قبل الدفع',
                  }, { preserveScroll: true });
                }}
              >
                <XCircle size={14} /> إلغاء
              </AppButton>
            ) : null}
          </div>
        );
      },
    },
  ], [onToggleRental]);

  return (
    <DataTable
      className="mb-8"
      columns={columns}
      data={rentals}
      getRowKey={(rental) => rental.id}
      loading={isLoading}
      loadingLabel="جاري تحميل العمليات..."
      rowClassName={(rental) => selectedRentalId === rental.id ? 'bg-[#EAF3E9]/60' : undefined}
      emptyState={{
        icon: '📄',
        title: 'لا توجد عمليات مطابقة',
        description: 'جرّب تغيير البحث أو تبويب الحالة.',
      }}
    />
  );
};

export default RentalsTable;
