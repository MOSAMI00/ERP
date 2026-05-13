import React, { useMemo, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { formatRentalDate } from '../../utils/formatters';
import { getReviewsConfig } from './lib/reviewsConfig';
import { ReviewSummary } from './ui/ReviewSummary';
import { TenantReviewsList } from './ui/TenantReviewsList';
import { OwnerReviewsList } from './ui/OwnerReviewsList';
import { PageHeader, FilterTabs } from '../../components/shared';

export default function ReviewsPage({ role: roleProp }) {
  const { props } = usePage();
  const user = props.auth?.user ?? null;
  const role = roleProp || user?.type || 'tenant';
  const config = getReviewsConfig(role);
  const [activeTab, setActiveTab] = useState(config.tabs[0]);

  const reviews = props.reviews ?? [];
  const rentals = props.rentals ?? [];
  const userId = user?.id;

  const sentReviews = useMemo(() => {
    return reviews
      .filter((review) => (review.reviewer_id ?? review.reviewerId) === userId)
      .map((review) => ({
        id: review.id,
        equipment: review.equipment_name ?? review.equipmentName ?? 'طلب إيجار',
        person: review.target_name ?? review.targetName ?? 'مستخدم',
        stars: review.rating,
        comment: review.review_text ?? review.reviewText,
        date: formatRentalDate(review.created_at ?? review.createdAt),
        image: review.equipment_image ?? '⭐',
      }));
  }, [reviews, userId]);

  const receivedReviews = useMemo(() => {
    return reviews
      .filter((review) => (review.target_id ?? review.targetId) === userId)
      .map((review) => ({
        id: review.id,
        equipment: review.equipment_name ?? review.equipmentName ?? 'طلب إيجار',
        person: review.reviewer_name ?? review.reviewerName ?? 'مستخدم',
        stars: review.rating,
        comment: review.review_text ?? review.reviewText,
        date: formatRentalDate(review.created_at ?? review.createdAt),
        image: review.equipment_image ?? '👤',
      }));
  }, [reviews, userId]);

  const pendingReviews = useMemo(() => {
    const reviewedRentalIds = new Set(
      reviews
        .filter((review) => (review.reviewer_id ?? review.reviewerId) === userId)
        .map((review) => review.rental_op_id ?? review.rentalOpId)
    );
    return rentals
      .filter((rental) => {
        if (rental.status !== 'completed' || reviewedRentalIds.has(rental.id)) return false;
        return role === 'owner'
          ? (rental.owner_id ?? rental.ownerId) === userId
          : (rental.tenant_id ?? rental.tenantId) === userId;
      })
      .map((rental) => ({
        id: rental.id,
        orderNum: rental.order_num ?? rental.orderNum,
        equipment: rental.equipment?.name ?? 'معدة',
        partnerName: role === 'owner'
          ? (rental.tenant?.name ?? 'مستأجر')
          : (rental.equipment?.owner_name ?? rental.equipment?.ownerName ?? 'مؤجر'),
        targetId: role === 'owner'
          ? (rental.tenant_id ?? rental.tenantId)
          : (rental.equipment?.owner_id ?? rental.equipment?.ownerId),
        image: rental.equipment?.image ?? (role === 'owner' ? '👤' : '⭐'),
        date: formatRentalDate(rental.end_date ?? rental.endDate),
      }));
  }, [rentals, reviews, role, userId]);

  const [ratingValues, setRatingValues] = useState({});
  const [comments, setComments] = useState({});

  const handlePendingSubmit = (item) => {
    router.post('/reviews', {
      rental_op_id: item.id,
      target_type: 'user',
      target_id: item.targetId,
      rating: ratingValues[item.id],
      review_text: comments[item.id] || '',
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setRatingValues((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
        setComments((prev) => { const n = { ...prev }; delete n[item.id]; return n; });
      },
    });
  };

  const tabRegistry = {
    مستلمة: receivedReviews,
    مرسلة: sentReviews,
    'بانتظار التقييم': pendingReviews,
  };
  const displayedList = tabRegistry[activeTab] || [];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader title={config.pageTitle} />

      <ReviewSummary reviews={[...receivedReviews, ...sentReviews]} />

      <FilterTabs
        tabs={config.tabs.map((tab) => {
          const list = tabRegistry[tab] || [];
          return { id: tab, label: tab, count: list.length };
        })}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {role === 'tenant' ? (
        <TenantReviewsList
          activeTab={activeTab}
          displayedList={displayedList}
          pendingReviews={pendingReviews}
          ratingValues={ratingValues}
          comments={comments}
          setRatingValues={setRatingValues}
          setComments={setComments}
          handlePendingSubmit={handlePendingSubmit}
          config={config}
        />
      ) : (
        <OwnerReviewsList
          activeTab={activeTab}
          displayedList={displayedList}
          pendingReviews={pendingReviews}
          ratingValues={ratingValues}
          comments={comments}
          setRatingValues={setRatingValues}
          setComments={setComments}
          handlePendingSubmit={handlePendingSubmit}
          config={config}
        />
      )}
    </div>
  );
}
