import React from 'react';

export function ReviewSummary({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const avgRating = reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length;
  
  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.stars) === stars).length;
    const percent = Math.round((count / reviews.length) * 100) || 0;
    return { stars, percent };
  });

  return (
    <div className="bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] rounded-2xl p-6 mb-6 text-white flex flex-wrap gap-8 items-center">
      <div className="text-center min-w-[140px]">
        <h2 className="text-6xl font-bold m-0 leading-none mb-2">{avgRating.toFixed(1)}</h2>
        <div className="flex justify-center gap-1 mb-2 text-[#F39C12] text-xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ opacity: avgRating >= star ? 1 : 0.4 }}>★</span>
          ))}
        </div>
        <p className="m-0 text-sm opacity-80">{reviews.length} تقييم</p>
      </div>

      <div className="flex-1 min-w-[200px] flex flex-col gap-2">
        {distribution.map((item) => (
          <div key={item.stars} className="flex items-center gap-3">
            <span className="w-6 text-sm font-semibold">{item.stars}★</span>
            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F39C12] rounded-full transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              />
            </div>
            <span className="w-10 text-sm text-left opacity-80">{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
