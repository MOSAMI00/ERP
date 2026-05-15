import { Link, usePage } from '@inertiajs/react';
import { Header } from './ui/Header';
import { Breadcrumb } from './ui/Breadcrumb';
import { Gallery } from './Gallery';
import { Tabs } from './Tabs';
import { BookingSidebar } from './BookingSidebar';
import { OwnerCard } from './ui/OwnerCard';
import { MobileBottomBar } from './ui/MobileBottomBar';

interface Owner {
  id?: number;
  full_name?: string;
  avatar?: string | null;
  rating?: number | null;
  operations_count?: number | null;
  governorate?: string | null;
  kyc_status?: string | null;
  created_at?: string | null;
}

interface Product {
  id: number;
  name: string;
  description?: string;
  category?: string;
  price: number;
  price_per_day?: number;
  insurance?: number;
  insurance_amount?: number;
  location?: string;
  address?: string;
  rental_terms?: string;
  status?: string;
  rating?: number;
  discount?: number;
  image?: string | null;
  images?: string[];
  owner?: Owner | null;
}

interface PageProps {
  product?: Product;
  [key: string]: unknown;
}

export default function ProductDetailPage() {
  const { props } = usePage<PageProps>();
  const product = props.product ?? null;

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <Link href="/" className="text-primary hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images ?? (product.image ? [product.image] : []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Breadcrumb category={product.category} name={product.name} />

      <main className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-6">
            <Gallery
              images={images}
              status={product.status}
              discount={product.discount}
            />
            <Tabs product={product} />
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <BookingSidebar product={product} />
              <OwnerCard owner={product.owner} />
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomBar dailyRate={product.price} />
    </div>
  );
}
