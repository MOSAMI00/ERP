import React from 'react';
import { DataTable, StatusBadge } from '../../../components/shared';
import { formatCurrency } from '../../../utils/formatters';
import { INSURANCE_STATUS_META } from '../lib/insuranceConfig';

export function TenantInsuranceTable({ rows }) {
  const columns = [
    { key: 'orderNum', header: 'الطلب', cell: (row) => row.orderNum },
    { key: 'partnerName', header: 'المؤجر', cell: (row) => row.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: 'مبلغ التأمين المحتجز', cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    {
      key: 'status',
      header: 'حالة الضمان',
      cell: (row) => <StatusBadge status={row.status} meta={INSURANCE_STATUS_META[row.status]} />,
    },
    { key: 'deduction', header: 'خصومات مطروحة', cell: (row) => row.deduction },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowKey={(row) => row.id}
    />
  );
}
