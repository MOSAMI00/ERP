import { MapPin, Star, Tag, Heart } from 'lucide-react';


export function ProductCard({
  name,
  image,
  price,
  oldPrice,
  insurance,
  location,
  category,
  rating,
  reviews,
  status,
  discount,
  onDetailsClick,
  onRentClick,
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {status === 'available' && (
            <span className="px-3 py-1 bg-[#27AE60] text-white text-sm rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              متاح
            </span>
          )}
          {discount && (
            <span className="px-3 py-1 bg-[#F39C12] text-white text-sm rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
          onClick={(e) => e.preventDefault()}
        >
          <Heart className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>

        {/* Location & Category */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4" />
            <span>{category}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(rating)
                  ? 'fill-[#F39C12] text-[#F39C12]'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground mr-1">({reviews} تقييم)</span>
        </div>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {price.toLocaleString('ar-YE')} ر.ي
            </span>
            <span className="text-sm text-muted-foreground">/ اليوم</span>
            {oldPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {oldPrice.toLocaleString('ar-YE')}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            التأمين: {insurance.toLocaleString('ar-YE')} ر.ي
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={(e) => {
              e.preventDefault();
              onDetailsClick?.(e);
            }}
            className="flex-1 h-11 bg-muted-foreground text-white rounded-lg hover:bg-muted-foreground/90 transition-colors font-semibold"
          >
            تفاصيل
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (onRentClick) {
                onRentClick(e);
              }
            }}
            className="flex-1 h-11 bg-[#de8c54] text-white rounded-lg hover:bg-[#c97d49] transition-colors font-semibold"
          >
            استأجره الآن
          </button>
        </div>
      </div>
    </div>
  );
}
