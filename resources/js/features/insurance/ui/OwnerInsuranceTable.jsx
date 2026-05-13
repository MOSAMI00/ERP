import React from 'react';
import { DataTable, StatusBadge } from '../../../components/shared';
import { formatCurrency } from '../../../utils/formatters';
import { INSURANCE_STATUS_META } from '../lib/insuranceConfig';

export function OwnerInsuranceTable({ rows }) {
  const columns = [
    { key: 'orderNum', header: 'الطلب', cell: (row) => row.orderNum },
    { key: 'partnerName', header: 'المستأجر', cell: (row) => row.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: 'قيمة مبلغ التأمين للمستأجر', cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    {
      key: 'status',
      header: 'حالة الوديعة',
      cell: (row) => <StatusBadge status={row.status} meta={INSURANCE_STATUS_META[row.status]} />,
    },
    { key: 'deduction', header: 'المطالبة بالتعويض', cell: (row) => row.deduction },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowKey={(row) => row.id}
    />
  );
}
