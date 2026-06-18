import { ChevronLeft, ChevronRight } from 'lucide-react';


export function ImageDisplay({ images, currentImageIndex, setCurrentImageIndex, status, discount }) {
  return (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted">
      <img
        src={images[currentImageIndex]}
        alt="Product"
        className="w-full h-full object-cover"
      />

      {/* Badges */}
      <div className="absolute top-4 right-4 flex gap-2">
        {status === 'available' && (
          <span className="px-4 py-2 bg-[#27AE60] text-white rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            متاح الآن
          </span>
        )}
        {discount && (
          <span className="px-4 py-2 bg-[#F39C12] text-white rounded-full">
            -{discount}%
          </span>
        )}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    </div>
  );
}
