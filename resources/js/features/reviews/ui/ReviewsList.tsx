import React from 'react';
import { EmptyState } from '../../../components/shared';
import { ReviewCard } from './ReviewCard';

export function ReviewsList({
  activeTab,
  displayedList,
  pendingReviews,
  ratingValues,
  comments,
  setRatingValues,
  setComments,
  handlePendingSubmit,
  config,
  role = 'tenant',
}) {
  if (activeTab === 'بانتظار التقييم') {
    return (
      <div className="flex flex-col gap-4">
        {pendingReviews.length > 0 ? (
          pendingReviews.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] overflow-hidden flex-shrink-0">
                  {item.image?.startsWith?.('http') || item.image?.startsWith?.('/') ? (
                    <img src={item.image} alt={item.equipment} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{item.image || '⭐'}</div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#222222] text-sm">{item.equipment}</p>
                  <p className="text-xs text-[#888888]">العملية: {item.orderNum} • {item.partnerName} • {item.date}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex text-3xl cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingValues({ ...ratingValues, [item.id]: star })}
                      className={`transition-colors ${star <= (ratingValues[item.id] || 0) ? 'text-[#F39C12]' : 'text-[#E0E0E0]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder={role === 'owner' ? 'اكتب تعليقك وتقييمك للمستأجر هنا...' : 'اكتب تقييمك للمؤجر وتجربتك مع المعدة هنا...'}
                  value={comments[item.id] || ''}
                  onChange={(e) => setComments({ ...comments, [item.id]: e.target.value })}
                  className="w-full bg-[#F4F6F9] border-none rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] resize-none"
                  rows={3}
                />

                <button
                  type="button"
                  disabled={!ratingValues[item.id]}
                  onClick={() => handlePendingSubmit(item)}
                  className="w-full md:w-auto self-end bg-[#2D5A27] text-white px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity"
                >
                  إرسال التقييم
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon="⭐" title="لا توجد تقييمات معلقة" description="أنجزت جميع تقييماتك!" />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {displayedList.length > 0 ? (
        displayedList.map((review) => <ReviewCard key={review.id} review={review} />)
      ) : (
        <EmptyState
          icon={config.emptyStateIcon}
          title={config.emptyStateTitle}
          description={config.emptyStateDesc}
        />
      )}
    </div>
  );
}
