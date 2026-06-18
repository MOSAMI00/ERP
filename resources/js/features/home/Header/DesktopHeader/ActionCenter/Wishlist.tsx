import { Heart } from 'lucide-react';
import { useState } from 'react';

export function Wishlist() {
  const [wishlistCount] = useState(2);

  return (
    <button className="relative p-2 rounded-lg hover:bg-muted transition-colors group">
      <Heart className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      {wishlistCount > 0 && (
        <span className="absolute top-1 left-1 w-4 h-4 bg-primary text-white text-[9px] rounded-full flex items-center justify-center">
          {wishlistCount}
        </span>
      )}
    </button>
  );
}
