import React from 'react';

export function ReviewCard({ review }) {
  const isImageUrl = review.image?.startsWith('http');

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
          {isImageUrl ? (
            <img src={review.image} alt={review.equipment} className="w-full h-full object-cover" />
          ) : (
            review.image || '👤'
          )}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#222222] text-sm">{review.equipment || 'معدة غير معروفة'}</p>
          <p className="text-xs text-[#888888]">{review.person || 'مستخدم'}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex text-[#F39C12] text-sm">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} style={{ opacity: star <= review.stars ? 1 : 0.3 }}>★</span>
              ))}
            </div>
            <span className="font-bold text-[#F39C12] text-sm">{review.stars}.0</span>
          </div>
        </div>
        <span className="text-xs text-[#888888]">{review.date}</span>
      </div>
      {review.comment ? (
        <p className="text-sm text-[#888888] bg-[#F4F6F9] rounded-xl p-3 leading-relaxed m-0">
          "{review.comment}"
        </p>
      ) : null}
    </div>
  );
}
