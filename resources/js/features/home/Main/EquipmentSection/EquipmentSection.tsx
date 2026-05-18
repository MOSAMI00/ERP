import React from 'react';
import { visit } from '../../../../inertia/navigation';
import { ProductCard } from './ProductCard';
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Tag } from 'lucide-react';

export function EquipmentSection({ products = [], onDetailsClick, activeCategory, searchQuery, selectedCity }) {
  const filteredProducts = products.filter((product) => {
    // Search Filter (Client-side)
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });
  
  return (
    <section id="equipment-section" className="py-20 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">اكتشف المعدات</h2>
            <p className="text-gray-500 font-medium">أفضل المعدات المتاحة للإيجار في منطقتك</p>
          </div>
          <Link 
            href="/equipment" 
            className="text-[#2D5A27] font-bold flex items-center gap-2 hover:gap-3 transition-all"
          >
            عرض الكل <span>←</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id}>
                <Link href={`/product/${product.id}`} className="block h-full">
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
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-gray-300 mb-6">
                <Tag size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">لم نجد أي معدات</h3>
              <p className="text-gray-500 max-w-xs mx-auto">جرب تغيير الفئة أو البحث عن شيء آخر لتجد ما تبحث عنه.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
