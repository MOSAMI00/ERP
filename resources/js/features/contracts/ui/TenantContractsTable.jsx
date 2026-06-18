import React from 'react';
import { AppButton, DataTable, StatusBadge } from '../../../components/shared';

export function TenantContractsTable({ contracts, onViewContract }) {
  const columns = [
    { key: 'number', header: 'رقم العقد', cell: (contract) => contract.number },
    { key: 'partner', header: 'المؤجر', cell: (contract) => contract.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (contract) => contract.equipment },
    { key: 'amount', header: 'القيمة الإجمالية', cell: (contract) => contract.amount },
    {
      key: 'status',
      header: 'الحالة',
      cell: (contract) => <StatusBadge status={contract.status} label={contract.statusLabel} />,
    },
    {
      key: 'view',
      header: 'العقد',
      cell: (contract) => (
        <AppButton variant="outline" size="sm" onClick={() => onViewContract(contract)}>
          عرض العقد
        </AppButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={contracts}
      getRowKey={(contract) => contract.id}
    />
  );
}
