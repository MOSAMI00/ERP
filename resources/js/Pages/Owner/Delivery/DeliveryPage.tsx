import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { DeliveryPage } from "../../../features/delivery";
export default function OwnerDeliveryPage(props) {
  return <DeliveryPage role="owner" {...props} />;
}

OwnerDeliveryPage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
