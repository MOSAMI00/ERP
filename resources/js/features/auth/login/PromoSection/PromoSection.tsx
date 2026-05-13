import { Headlines } from './Headlines';
import { FeaturesList } from './FeaturesList';

export function PromoSection() {
  return (
    <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#2D5A27] to-[#1a3a15] p-12 items-center justify-center">
      <div className="max-w-lg text-white space-y-8">
        <Headlines />
        <FeaturesList />
      </div>
    </div>
  );
}
