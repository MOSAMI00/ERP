import { MapPin, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LocationSelector() {
  const [locationMenuOpen, setLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target)) {
        setLocationMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={locationMenuRef}>
      <button 
        onClick={() => setLocationMenuOpen(!locationMenuOpen)}
        className="flex items-center gap-2 px-3 h-10 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all"
      >
        <MapPin className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">صنعاء</span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>
      
      {locationMenuOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-border rounded-lg shadow-lg z-[60] overflow-hidden">
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <p className="text-[10px] font-bold text-muted-foreground uppercase">اختر المحافظة</p>
          </div>
          {['صنعاء', 'عدن', 'تعز', 'حضرموت', 'الحديدة', 'إب'].map((city) => (
            <button key={city} className="w-full text-right px-3 py-2 hover:bg-primary/5 hover:text-primary text-sm transition-colors">
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
