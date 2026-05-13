import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { SettingsPage } from "../../../features/settings";
export default function TenantSettingsPage(props) {
  return <SettingsPage role="tenant" {...props} />;
}

TenantSettingsPage.layout = page => <TenantLayout>{page}</TenantLayout>;
