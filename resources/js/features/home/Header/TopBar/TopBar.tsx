import { Globe, ChevronDown, Phone, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function TopBar() {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="hidden md:block bg-primary/5 border-b border-primary/10">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between text-[13px] text-muted-foreground">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
              <Phone className="w-3.5 h-3.5" />
              <span>+967 777 000 000</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
              <Mail className="w-3.5 h-3.5" />
              <span>support@rental.ye</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-primary font-medium">عروض خاصة!</span>
              <span>خصم 20% على المولدات هذا الأسبوع</span>
            </div>
            <div className="w-px h-3 bg-border" />
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 hover:text-primary transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>العربية (اليمن)</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-32 bg-white border border-border rounded-lg shadow-lg z-[60] overflow-hidden">
                  <button className="w-full text-right px-3 py-2 hover:bg-muted text-sm transition-colors">العربية</button>
                  <button className="w-full text-right px-3 py-2 hover:bg-muted text-sm transition-colors">English</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
