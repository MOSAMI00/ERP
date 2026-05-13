import { Link } from '@inertiajs/react';

export function CartHeader() {
  return (
    <div className="border-b border-border sticky top-0 z-10 bg-white">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline">
            → إلغاء والعودة
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold">م</span>
            </div>
            <span className="font-bold text-primary">منصة تأجير المعدات</span>
          </div>
        </div>
      </div>
    </div>
  );
}
