import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { DeliveryPage } from "../../../features/delivery";
export default function TenantDeliveryPage(props) {
  return <DeliveryPage role="tenant" {...props} />;
}

TenantDeliveryPage.layout = page => <TenantLayout>{page}</TenantLayout>;
