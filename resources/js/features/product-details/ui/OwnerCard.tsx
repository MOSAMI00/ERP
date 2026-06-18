import { Star, MapPin, Package, ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface Owner {
  id?: number;
  full_name?: string;
  name?: string;
  avatar?: string | null;
  rating?: number | null;
  operations_count?: number | null;
  governorate?: string | null;
  kyc_status?: string | null;
  created_at?: string | null;
}

interface OwnerCardProps {
  owner?: Owner | null;
}

export function OwnerCard({ owner }: OwnerCardProps) {
  if (!owner) return null;

  const name = owner.full_name ?? owner.name ?? 'المالك';
  const rating = owner.rating ?? 0;
  const rentalsCount = owner.operations_count ?? 0;
  const location = owner.governorate ?? 'غير محدد';
  const isVerified = owner.kyc_status === 'approved';

  // Year owner joined (from created_at)
  const joinYear = owner.created_at
    ? new Date(owner.created_at).getFullYear()
    : null;

  return (
    <div className="bg-muted rounded-xl p-6 mt-4">
      <h3 className="font-bold mb-4">عن المؤجر</h3>

      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        {owner.avatar ? (
          <img
            src={owner.avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-xl">
            👤
          </div>
        )}

        <div>
          <h4 className="font-semibold">{name}</h4>
          <div className="flex items-center gap-1 text-sm">
            <Star className="w-4 h-4 fill-[#F39C12] text-[#F39C12]" />
            <span>
              {rating > 0 ? rating.toFixed(1) : 'لا يوجد تقييم'}
              {rentalsCount > 0 && (
                <span className="text-muted-foreground ml-1">
                  ({rentalsCount} عملية)
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="text-sm space-y-1.5 text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4 shrink-0" />
          {location}
        </p>
        {rentalsCount > 0 && (
          <p className="flex items-center gap-2">
            <Package className="w-4 h-4 shrink-0" />
            {rentalsCount} تأجير مكتمل
          </p>
        )}
        {isVerified && (
          <p className="flex items-center gap-2 text-green-600">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            موثق {joinYear ? `منذ ${joinYear}` : ''}
          </p>
        )}
      </div>

      {owner.id && (
        <Link
          href={`/equipment?owner=${owner.id}`}
          className="block w-full mt-4 h-10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors text-sm font-medium leading-10 text-center"
        >
          عرض جميع المعدات
        </Link>
      )}
    </div>
  );
}
