import { Star } from 'lucide-react';


export function TabReviews({ product }) {
  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-5xl font-bold text-primary">{product.rating}</div>
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < product.rating ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{product.reviews} تقييم</p>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm w-8">{rating} ⭐</span>
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F39C12]"
                  style={{ width: `${rating === 5 ? 85 : rating === 4 ? 10 : 5}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-12">{rating === 5 ? 40 : rating === 4 ? 5 : 2}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 border-t border-border pt-6">
        {[
          { name: 'محمد أحمد', rating: 5, date: '2025-01-15', text: 'مولد ممتاز وبحالة ممتازة، المؤجر متعاون جداً' },
          { name: 'سعيد علي', rating: 5, date: '2025-01-10', text: 'خدمة احترافية وسريعة، أنصح بالتعامل' },
          { name: 'خالد حسن', rating: 4, date: '2025-01-05', text: 'جيد جداً، التسليم كان في الموعد' },
        ].map((review, i) => (
          <div key={i} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">{review.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'fill-[#F39C12] text-[#F39C12]' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
