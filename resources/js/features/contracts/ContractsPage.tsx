import React, { useMemo, useState } from "react";
import { usePage } from '@inertiajs/react';
import {
  AppInput,
  EmptyState,
  FilterTabs,
  PageHeader,
} from "../../components/shared";
import { getContractConfig } from "./lib/contractsConfig";
import { TenantContractsTable } from "./ui/TenantContractsTable";
import { OwnerContractsTable } from "./ui/OwnerContractsTable";
import { ContractDetailModal } from "./ui/ContractDetailModal";

const money = (value) => `${Number(value ?? 0).toLocaleString('ar-YE')} ر.ي`;
const enumValue = (value) => (typeof value === 'object' ? value?.value : value);
const statusFromContract = (contract) => {
  const contractStatus = enumValue(contract.status);
  const rentalStatus = enumValue(contract.rental?.status);
  if (contractStatus === 'signed' && ['completed'].includes(rentalStatus)) return 'completed';
  if (contractStatus === 'signed') return 'active';
  return 'pending';
};
const statusLabels = {
  pending: 'بانتظار التوقيع',
  active: 'نشط',
  completed: 'مكتمل',
  expired: 'منتهي',
};

export default function ContractsPage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || "tenant";
  const config = getContractConfig(role);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(config.tabs[0]);
  const [selectedContract, setSelectedContract] = useState(null);

  const contracts = useMemo(() => {
    return (props.contracts ?? []).map((contract) => {
      const rental = contract.rental ?? {};
      const equipment = rental.equipment ?? {};
      const partner = role === 'owner' ? rental.tenant : rental.owner;
      const status = statusFromContract(contract);

      return {
        ...contract,
        number: contract.number ?? contract.contract_num ?? `CT-${String(contract.id).padStart(4, '0')}`,
        partnerName: partner?.full_name ?? partner?.name ?? 'مستخدم غير معروف',
        equipment: equipment.name ?? 'معدة غير معروفة',
        amount: money(rental.total_amount ?? rental.totalAmount),
        status,
        statusLabel: statusLabels[status] ?? status,
        body: contract.contract_body ?? contract.contractBody,
        rental,
      };
    });
  }, [props.contracts, role]);

  const filtered = useMemo(() => {
    const allowedStatuses = config.statusesByTab[activeTab] || [];
    const lowered = search.trim();

    return contracts.filter((contract) => {
      const matchesTab =
        allowedStatuses.length === 0 ||
        allowedStatuses.includes(contract.status);
      const matchesSearch =
        lowered.length === 0 ||
        (contract.number ?? contract.contract_num ?? '').includes(lowered) ||
        (contract.partnerName ?? contract.partner_name ?? '').includes(lowered) ||
        (contract.equipment ?? '').includes(lowered);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, config.statusesByTab, contracts, search]);

  return (
    <div
      className="p-4 md:p-6 pb-24 md:pb-6"
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <PageHeader
        title={config.pageTitle}
        description={`${contracts.length} عقد`}
        actions={
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={config.searchPlaceholder}
            className="w-full md:w-80"
          />
        }
      />

      <FilterTabs
        tabs={config.tabs.map((tab) => ({
          id: tab,
          label: tab,
          count: contracts.filter((contract) => {
            const allowedStatuses = config.statusesByTab[tab] || [];
            return (
              allowedStatuses.length === 0 ||
              allowedStatuses.includes(contract.status)
            );
          }).length,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {filtered.length > 0 ? (
        role === "tenant" ? (
          <TenantContractsTable
            contracts={filtered}
            onViewContract={setSelectedContract}
          />
        ) : (
          <OwnerContractsTable
            contracts={filtered}
            onViewContract={setSelectedContract}
          />
        )
      ) : (
        <EmptyState
          compact
          icon="📄"
          title="لا توجد عقود مطابقة"
          description="جرّب تعديل البحث أو اختيار تبويب مختلف."
        />
      )}

      <ContractDetailModal
        contract={selectedContract}
        config={config}
        onClose={() => setSelectedContract(null)}
      />
    </div>
  );
}
