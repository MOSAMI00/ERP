import { Link } from '@inertiajs/react';

export function AuthButtons() {
  return (
    <>
      <Link
        href="/login"
        className="px-4 h-10 rounded-lg hover:bg-muted transition-colors flex items-center justify-center"
      >
        تسجيل الدخول
      </Link>

      <Link
        href="/register?role=owner"
        className="px-6 h-12 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
      >
        أضف معدتك
      </Link>
    </>
  );
}
