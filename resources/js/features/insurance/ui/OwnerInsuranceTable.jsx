import React from 'react';
import { DataTable, StatusBadge } from '../../../Components/shared';
import { formatCurrency } from '../../../utils/formatters';
import { INSURANCE_STATUS_META } from '../lib/insuranceConfig';

export function OwnerInsuranceTable({ rows }) {
  const columns = [
    { key: 'orderNum', header: 'الطلب', cell: (row) => row.orderNum },
    { key: 'partnerName', header: 'المستأجر', cell: (row) => row.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: 'مبلغ التأمين', cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    { key: 'held', header: 'المحتجز', cell: (row) => `${formatCurrency(row.heldAmount)} ر.ي` },
    { key: 'claim', header: 'مطالبتك بالخصم', cell: (row) => `${formatCurrency(row.ownerRequestedAmount)} ر.ي` },
    { key: 'tenantOffer', header: 'اقتراح المستأجر', cell: (row) => row.tenantProposedAmount ? `${formatCurrency(row.tenantProposedAmount)} ر.ي` : '—' },
    { key: 'finalDeduction', header: 'الخصم النهائي لك', cell: (row) => (
      <div>
        <strong className={row.finalDeduction > 0 ? 'text-[#B9770E]' : 'text-[#888888]'}>
          {formatCurrency(row.finalDeduction)} ر.ي
        </strong>
        {row.adminNote ? <p className="m-0 mt-1 text-xs text-[#888888]">{row.adminNote}</p> : null}
      </div>
    ) },
    { key: 'refund', header: 'المعاد للمستأجر', cell: (row) => `${formatCurrency(row.refundAmount)} ر.ي` },
    {
      key: 'status',
      header: 'حالة الوديعة',
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
