import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { SettingsPage } from "../../../features/settings";
export default function OwnerSettingsPage(props) {
  return <SettingsPage role="owner" {...props} />;
}

OwnerSettingsPage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
