import React from 'react';
import { AppButton, DataTable, StatusBadge } from '../../../components/shared';

export function OwnerContractsTable({ contracts, onViewContract }) {
  const columns = [
    { key: 'number', header: 'رقم العقد', cell: (contract) => contract.number },
    { key: 'partner', header: 'المستأجر', cell: (contract) => contract.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (contract) => contract.equipment },
    { key: 'amount', header: 'صافي الأرباح', cell: (contract) => contract.amount },
    {
      key: 'status',
      header: 'حالة العقد',
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
