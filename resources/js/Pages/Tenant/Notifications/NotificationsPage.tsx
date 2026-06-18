import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { NotificationsPage } from "../../../features/notifications";
export default function TenantNotificationsPage(props) {
  return <NotificationsPage role="tenant" {...props} />;
}

TenantNotificationsPage.layout = page => <TenantLayout>{page}</TenantLayout>;
