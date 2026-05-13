import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { InsurancePage } from "../../../features/insurance";
export default function OwnerInsurancePage(props) {
  return <InsurancePage role="owner" {...props} />;
}

OwnerInsurancePage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
