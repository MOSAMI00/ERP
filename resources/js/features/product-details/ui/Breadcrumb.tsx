import { Link } from '@inertiajs/react';


export function Breadcrumb({ category, name }) {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">الرئيسية</Link>
        <span>/</span>
        <button className="hover:text-primary">{category}</button>
        <span>/</span>
        <span className="text-foreground">{name}</span>
      </div>
    </div>
  );
}
