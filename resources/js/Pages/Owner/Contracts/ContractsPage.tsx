import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { ContractsPage } from "../../../features/contracts";
export default function OwnerContractsPage(props) {
  return <ContractsPage role="owner" {...props} />;
}

OwnerContractsPage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
