import { Link } from '@inertiajs/react';

export function LogoSection() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
        <span className="text-white font-bold text-xl">م</span>
      </div>
      <span className="font-bold text-lg text-primary">منصة تأجير المعدات</span>
    </Link>
  );
}
