import { MapPin } from 'lucide-react';


export function PriceCard({ product, dailyRate, deposit }) {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{product.location}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            {dailyRate.toLocaleString('ar-YE')} ر.ي
          </span>
          <span className="text-muted-foreground">/ اليوم</span>
          {product.oldPrice && (
            <span className="text-muted-foreground line-through">{product.oldPrice.toLocaleString('ar-YE')}</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          التأمين: {deposit.toLocaleString('ar-YE')} ر.ي
        </p>
      </div>
    </>
  );
}
