import React, { useMemo } from 'react';
import { Eye } from 'lucide-react';
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
      cell: (rental) => rental.orderNum ?? '—',
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
      cell: (rental) => <DateRangeText start={rental.startDate} end={rental.endDate} className="text-xs" />,
    },
    {
      key: 'total',
      header: 'الإجمالي',
      cell: (rental) => <MoneyText value={rental.totalAmount} />,
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (rental) => <StatusBadge status={rental.status} />,
    },
    {
      key: 'actions',
      header: 'إجراء',
      cell: (rental) => (
        <AppButton
          variant="outline"
          size="sm"
          onClick={() => onToggleRental(rental.id)}
        >
          <Eye size={14} /> عرض
        </AppButton>
      ),
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
