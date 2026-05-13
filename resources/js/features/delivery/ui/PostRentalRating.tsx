import React, { useState } from 'react';
import { AppButton } from '../../../components/shared';

/**
 * Post-rental inline rating prompt shown after a rental is completed.
 * Provides a "تخطي الآن" (Skip for now) option.
 */
export function PostRentalRating({ rental, onSubmit, onSkip }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [skipped, setSkipped] = useState(false);

  if (submitted || skipped) return null;

  return (
    <div className="mt-5 rounded-2xl border border-[#F39C12]/30 bg-gradient-to-br from-[#FFFDF5] to-[#FFF9ED] p-5">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F39C12]/10 text-xl">⭐</span>
        <div>
          <h3 className="m-0 text-base font-bold text-[#222222]">قيّم تجربتك</h3>
          <p className="m-0 mt-0.5 text-xs text-[#888888]">
            كيف كانت تجربتك مع {rental?.partnerLabel}: {rental?.partnerName}؟
          </p>
        </div>
      </div>

      <div className="mb-4 flex cursor-pointer gap-1 text-3xl">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`transition-all duration-200 hover:scale-110 ${
              star <= rating ? 'text-[#F39C12]' : 'text-[#E0E0E0]'
            }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="اكتب تعليقك هنا (اختياري)..."
        rows={3}
        className="mb-4 w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
      />

      <div className="flex flex-wrap items-center gap-3">
        <AppButton
          disabled={rating === 0}
          onClick={() => {
            onSubmit({ rating, comment });
            setSubmitted(true);
          }}
        >
          إرسال التقييم
        </AppButton>
        <button
          type="button"
          onClick={() => {
            setSkipped(true);
            onSkip?.();
          }}
          className="rounded-xl border border-[#E0E0E0] px-5 py-2 text-sm font-semibold text-[#888888] transition-colors hover:bg-[#F4F6F9] hover:text-[#555555]"
        >
          تخطي الآن
        </button>
      </div>
    </div>
  );
}
