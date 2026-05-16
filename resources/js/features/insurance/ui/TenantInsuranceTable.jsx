import React from 'react';
import { DataTable, StatusBadge } from '../../../Components/shared';
import { formatCurrency } from '../../../utils/formatters';
import { INSURANCE_STATUS_META } from '../lib/insuranceConfig';

export function TenantInsuranceTable({ rows }) {
  const columns = [
    { key: 'orderNum', header: 'الطلب', cell: (row) => row.orderNum },
    { key: 'partnerName', header: 'المؤجر', cell: (row) => row.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: 'مبلغ التأمين', cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    { key: 'held', header: 'المحتجز حالياً', cell: (row) => `${formatCurrency(row.heldAmount)} ر.ي` },
    { key: 'ownerDeduction', header: 'خصم المؤجر', cell: (row) => `${formatCurrency(row.ownerRequestedAmount)} ر.ي` },
    { key: 'finalDeduction', header: 'الخصم النهائي', cell: (row) => (
      <div>
        <strong className={row.finalDeduction > 0 ? 'text-[#B9770E]' : 'text-[#27AE60]'}>
          {formatCurrency(row.finalDeduction)} ر.ي
        </strong>
        {row.adminNote ? <p className="m-0 mt-1 text-xs text-[#888888]">{row.adminNote}</p> : null}
      </div>
    ) },
    { key: 'refund', header: 'المسترد لك', cell: (row) => `${formatCurrency(row.refundAmount)} ر.ي` },
    {
      key: 'status',
      header: 'حالة الضمان',
      cell: (row) => <StatusBadge status={row.status} meta={INSURANCE_STATUS_META[row.status]} />,
    },
    { key: 'deduction', header: 'سبب الخصم/الحالة', cell: (row) => row.deductionReason || row.rentalStatusLabel || '—' },
  ];

  return (
    <DataTable
      columns={columns}
      data={rows}
      getRowKey={(row) => row.id}
    />
  );
}
