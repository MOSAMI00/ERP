import { cn } from '../ui/utils';

export function LoadingState({
  label = 'جاري التحميل...',
  className,
}) {
  return (
    <div className={cn('rounded-xl border border-[#E0E0E0] bg-white p-8 text-center text-sm text-[#888888]', className)}>
      <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#E0E0E0] border-t-[#2D5A27]" />
      {label}
    </div>
  );
}

export function SkeletonBlock({ className }) {
  return <div className={cn('animate-pulse rounded-lg bg-[#E0E0E0]', className)} />;
}

export function SkeletonGrid({
  count = 4,
  className,
  itemClassName,
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 md:grid-cols-2', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={cn('rounded-xl border border-[#E0E0E0] bg-white p-5', itemClassName)}>
          <SkeletonBlock className="mb-4 h-5 w-1/2" />
          <SkeletonBlock className="mb-2 h-4 w-full" />
          <SkeletonBlock className="h-4 w-2/3" />
        </div>
      ))}
    </div>
  );
}
