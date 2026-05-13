import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { ContractsPage } from "../../../features/contracts";
export default function TenantContractsPage(props) {
  return <ContractsPage role="tenant" {...props} />;
}

TenantContractsPage.layout = page => <TenantLayout>{page}</TenantLayout>;
