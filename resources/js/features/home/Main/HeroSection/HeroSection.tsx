import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const slides = [
  {
    title: 'استأجر معداتك بسهولة في اليمن',
    subtitle: 'آلاف المعدات متاحة في محافظتك',
    cta: 'تصفح الآن',
    image: 'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=1920',
  },
  {
    title: 'ابنِ بدون تكلفة الشراء',
    subtitle: 'معدات بناء احترافية بأسعار تأجير يومية مناسبة',
    cta: 'تصفح الآن',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&h=600&fit=crop',
  },
  {
    title: 'ازرع اكثر , انفق اقل',
    subtitle: 'معدات زراعية حديثة لزيادة إنتاجك',
    cta: 'تصفح الآن',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&h=600&fit=crop',
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[520px] md:h-[420px] lg:h-[520px] max-sm:h-[280px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 🔥 Strong consistent overlay */}
            <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/80 to-black/50" />

            <div className="container mx-auto px-6 h-full flex items-center">
              <div className="max-w-2xl space-y-6 text-white max-sm:text-center max-sm:w-full">

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/90 leading-relaxed max-sm:text-base drop-shadow-md">
                  {slide.subtitle}
                </p>

                {/* Buttons - Enhanced Version */}
                <div className="flex gap-4 max-sm:flex-col max-sm:w-full">

                  {/* OPTION 1: Modern Gradient Button with Icon */}
                  <button className="group relative px-8 h-14 bg-gradient-to-r from-white to-gray-100 text-primary rounded-xl font-bold shadow-2xl hover:shadow-2xl transition-all duration-300 max-sm:w-full overflow-hidden">
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {slide.cta}
                      <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>

                  {/* OPTION 2: Glassmorphism Style (Uncomment to use instead) */}
                  {/* <button className="px-8 h-14 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-xl font-bold shadow-xl hover:bg-white/30 hover:scale-105 transition-all duration-300 max-sm:w-full group">
                    <span className="flex items-center justify-center gap-2">
                      {slide.cta}
                      <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button> */}

                  {/* OPTION 3: Neon Glow Effect (Uncomment to use instead) */}
                  {/* <button className="px-8 h-14 bg-transparent border-2 border-white text-white rounded-xl font-bold shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:bg-white/10 transition-all duration-300 max-sm:w-full group">
                    <span className="flex items-center justify-center gap-2">
                      {slide.cta}
                      <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button> */}

                  {/* OPTION 4: Premium 3D Style (Uncomment to use instead) */}
                  {/* <button className="px-8 h-14 bg-white text-primary rounded-xl font-bold shadow-[0_8px_0_0_#d1d5db] hover:shadow-[0_4px_0_0_#d1d5db] hover:translate-y-1 transition-all duration-300 max-sm:w-full group">
                    <span className="flex items-center justify-center gap-2">
                      {slide.cta}
                      <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </button> */}

                  {/* Secondary CTA */}
                  <button className="px-8 h-14 border-2 border-white/60 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300 max-sm:w-full">
                    تعرف أكثر
                  </button>

                </div>

              </div>
            </div>
          </div>
        ))}

        {/* Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition max-sm:w-10 max-sm:h-10"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center transition max-sm:w-10 max-sm:h-10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 w-2'
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}