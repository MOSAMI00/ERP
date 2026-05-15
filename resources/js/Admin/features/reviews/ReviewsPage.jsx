import ReviewsFilterBar from './components/ReviewsFilterBar';
import ReviewsTable from './components/ReviewsTable';
import ReviewDrawer from './components/ReviewDrawer';
import useDrawer from '../../hooks/useDrawer';
import { usePage } from '@inertiajs/react';
import { asArray, normalizeReview } from '../../../utils/pageData';

export default function ReviewsPage() {
  const { props } = usePage();
  const drawer = useDrawer();
  const reviews = asArray(props.reviews).map((review) => {
    const normalized = normalizeReview(review);
    return {
      ...normalized,
      rater: normalized.reviewer.name,
      raterType: normalized.reviewer.type,
      target: review.rental?.equipment?.name ?? review.target_type,
      targetType: review.target_type,
      text: normalized.text,
      date: normalized.created_at ?? normalized.createdAt ?? '',
      status: normalized.status === 'hidden' ? 'مخفي' : 'نشط',
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <ReviewsFilterBar />
      <ReviewsTable reviews={reviews} onOpenDrawer={drawer.open} />
      <ReviewDrawer isOpen={drawer.isOpen} review={drawer.selectedItem} onClose={drawer.close} />
    </div>
  );
}
