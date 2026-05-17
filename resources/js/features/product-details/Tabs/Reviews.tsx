import { Star } from 'lucide-react';

interface OwnerReview {
  id: number;
  rating: number;
  review_text?: string | null;
  created_at?: string | null;
  reviewer?: {
    full_name?: string | null;
    avatar?: string | null;
  };
  operation?: {
    id?: number | string | null;
  };
}

interface OwnerReviewsPayload {
  average: number;
  count: number;
  items: OwnerReview[];
}

export function TabReviews({ ownerReviews }: { product: any; ownerReviews?: OwnerReviewsPayload }) {
  const reviews = ownerReviews?.items ?? [];
  const average = Number(ownerReviews?.average ?? 0);
  const count = Number(ownerReviews?.count ?? reviews.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary">{average.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(average) ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{count} تقييم للمؤجر</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const ratingCount = reviews.filter((review) => Math.round(Number(review.rating)) === rating).length;
            const percent = count > 0 ? Math.round((ratingCount / count) * 100) : 0;
            return (
              <div key={rating} className="flex items-center gap-3">
                <span className="text-sm w-8">{rating} ⭐</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-[#F39C12]" style={{ width: `${percent}%` }} />
                </div>
                <span className="text-sm text-muted-foreground w-12">{ratingCount}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        {reviews.length > 0 ? reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{review.reviewer?.full_name ?? 'مستخدم'}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(Number(review.rating)) ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.created_at ?? '—'}</span>
                  {review.operation?.id ? (
                    <span className="text-xs text-muted-foreground">عملية #{review.operation.id}</span>
                  ) : null}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.review_text ?? 'لا يوجد تعليق نصي.'}</p>
          </div>
        )) : (
          <p className="text-muted-foreground">لا توجد تقييمات منشورة لهذا المؤجر بعد.</p>
        )}
      </div>
    </div>
  );
}
