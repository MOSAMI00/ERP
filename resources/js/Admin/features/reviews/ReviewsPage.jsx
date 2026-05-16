import ReviewsFilterBar from './components/ReviewsFilterBar';
import ReviewsTable from './components/ReviewsTable';
import ReviewDrawer from './components/ReviewDrawer';
import useDrawer from '../../hooks/useDrawer';
import { router, usePage } from '@inertiajs/react';
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
      rawStatus: normalized.status,
      status: normalized.status === 'hidden' ? 'مخفي' : 'نشط',
    };
  });

  const hideReview = (review) => {
    router.post(route('admin.reviews.hide', review.id), {}, { preserveScroll: true });
  };

  const restoreReview = (review) => {
    router.post(route('admin.reviews.restore', review.id), {}, { preserveScroll: true });
  };

  const deleteReview = (review) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;

    router.delete(route('admin.reviews.destroy', review.id), {
      preserveScroll: true,
      onSuccess: drawer.close,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <ReviewsFilterBar />
      <ReviewsTable reviews={reviews} onOpenDrawer={drawer.open} onHide={hideReview} onRestore={restoreReview} onDelete={deleteReview} />
      <ReviewDrawer isOpen={drawer.isOpen} review={drawer.selectedItem} onClose={drawer.close} onHide={hideReview} onRestore={restoreReview} onDelete={deleteReview} />
    </div>
  );
}
