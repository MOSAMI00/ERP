import OwnerLayout from '../../../Layouts/owner/OwnerLayout';
import { ReviewsPage } from "../../../features/reviews";
export default function OwnerReviewsPage(props) {
  return <ReviewsPage role="owner" {...props} />;
}

OwnerReviewsPage.layout = page => <OwnerLayout>{page}</OwnerLayout>;
