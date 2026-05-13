import { ShoppingCart } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function CartButton() {
  return (
    <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
      <ShoppingCart className="w-5 h-5 text-foreground hover:text-primary transition-colors" />
      <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border border-white">
        1
      </span>
    </Link>
  );
}
