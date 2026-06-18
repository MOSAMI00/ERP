import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { NotificationsPage } from "../../../features/notifications";
export default function OwnerNotificationsPage(props) {
  return <NotificationsPage role="owner" {...props} />;
}

OwnerNotificationsPage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
