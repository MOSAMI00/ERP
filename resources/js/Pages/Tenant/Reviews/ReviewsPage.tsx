import TenantLayout from '../../../Layouts/tenant/TenantLayout';
import { ReviewsPage } from "../../../features/reviews";
export default function TenantReviewsPage(props) {
  return <ReviewsPage role="tenant" {...props} />;
}

TenantReviewsPage.layout = page => <TenantLayout>{page}</TenantLayout>;
