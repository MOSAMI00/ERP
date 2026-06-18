import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { InsurancePage } from "../../../features/insurance";
export default function TenantInsurancePage(props) {
  return <InsurancePage role="tenant" {...props} />;
}

TenantInsurancePage.layout = page => <TenantLayout>{page}</TenantLayout>;
