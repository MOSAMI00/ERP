import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { HeroSection } from './Main/HeroSection/HeroSection';
import { TrustStrip } from './Main/HeroSection/TrustStrip';
import { EquipmentSection } from './Main/EquipmentSection/EquipmentSection';
import { HowItWorks } from './Main/HowItWorks/HowItWorks';
import { JoinCTA } from './Main/JoinCTA/JoinCTA';
import { ReviewsSection } from './Main/ReviewsSection/ReviewsSection';
import { ProductDetailsModal } from './ProductDetailsModal/ProductDetailsModal';

export default function HomePage() {
  const { props } = usePage();
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        
        <EquipmentSection 
          products={props.products ?? []}
          onDetailsClick={setSelectedProductForModal} 
          activeCategory={activeCategory}
          searchQuery={searchQuery}
        />
        
        <HowItWorks />
        
        <JoinCTA />
        
        <ReviewsSection />
      </main>

      <Footer />

      <ProductDetailsModal
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        product={selectedProductForModal}
      />
    </div>
  );
}
