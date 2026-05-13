import { visit } from '../../../../inertia/navigation';
import { ProductCard } from './ProductCard';
import { Link } from '@inertiajs/react';


export function EquipmentSection({ products = [], onDetailsClick, activeCategory, searchQuery }) {
  const filteredProducts = products.filter((product) => {
    // 1. Category Filter
    const matchesCategory = (() => {
      if (activeCategory === 'الكل') return true;
      const categoryMap: { [key: string]: string } = {
        'مولدات كهرباء': 'كهرباء',
        'بناء وأعمال': 'بناء',
        'زراعة': 'زراعة',
        'تصوير': 'تصوير',
        'رياضة': 'رياضة',
        'فعاليات': 'فعاليات',
        'طبي': 'طبي',
        'أخرى': 'أخرى'
      };
      const targetCategory = categoryMap[activeCategory] || activeCategory;
      return product.category === targetCategory;
    })();

    // 2. Search Filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">المعدات المتاحة</h2>
          <button className="text-primary hover:underline">عرض الكل ←</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="block">
                <ProductCard
                  {...product}
                  onDetailsClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDetailsClick(product);
                  }}
                  onRentClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    visit(`/product/${product.id}`);
                  }}
                />
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              لا توجد معدات متاحة في هذا القسم حالياً.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
