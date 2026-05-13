import React from 'react';
import { MapPin, Star, Tag, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
        <img
          src={image || 'https://images.unsplash.com/photo-1581094288338-2314dddb7eca?auto=format&fit=crop&q=80&w=800'} 
          alt={name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Status & Discount Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {status === 'active' || status === 'available' ? (
            <div className="backdrop-blur-md bg-emerald-500/80 text-white px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-emerald-400/30">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
              متاح الآن
            </div>
          ) : null}
          {discount && (
            <div className="backdrop-blur-md bg-orange-500/80 text-white px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg border border-orange-400/30">
              خصم {discount}%
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute top-4 left-4 w-10 h-10 backdrop-blur-md bg-white/70 hover:bg-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20 text-gray-700 hover:text-red-500"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="w-5 h-5" />
        </motion.button>

        {/* Floating Price Tag (appears on hover) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button 
            onClick={onRentClick}
            className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            استئجار سريع
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold text-primary-green uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
            {category}
          </span>
          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-amber-700">{rating || '4.8'}</span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-3 group-hover:text-primary-green transition-colors">
          {name}
        </h3>

        <div className="flex items-center gap-3 text-gray-500 text-xs mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>مؤمن بالكامل</span>
          </div>
        </div>

        {/* Pricing Area */}
        <div className="pt-4 border-t border-gray-50 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight mb-1">السعر اليومي</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black text-gray-900">
                {(price || 0).toLocaleString('ar-YE')}
              </span>
              <span className="text-xs font-bold text-gray-500">ر.ي</span>
            </div>
          </div>
          
          <button 
            onClick={onDetailsClick}
            className="text-sm font-bold text-primary-green hover:text-emerald-700 transition-colors"
          >
            عرض التفاصيل
          </button>
        </div>
      </div>
    </motion.div>
  );
}
