import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { get } from '../../inertia/navigation';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { HeroSection } from './Main/HeroSection/HeroSection';
import { TrustStrip } from './Main/HeroSection/TrustStrip';
import { EquipmentSection } from './Main/EquipmentSection/EquipmentSection';
import { HowItWorks } from './Main/HowItWorks/HowItWorks';
import { JoinCTA } from './Main/JoinCTA/JoinCTA';
import { ReviewsSection } from './Main/ReviewsSection/ReviewsSection';
import { ProductDetailsModal } from './ProductDetailsModal/ProductDetailsModal';

export default function HomePage(props) {
  const { products = [], categories = [], cities = [], filters = {} } = props;
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  
  // Local state for UI responsiveness
  const [activeCategory, setActiveCategory] = useState(filters.category || 'الكل');
  const [selectedCity, setSelectedCity] = useState(filters.city || 'الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync state when props change (Inertia navigation)
  useEffect(() => {
    setActiveCategory(filters.category || 'الكل');
    setSelectedCity(filters.city || 'الكل');
  }, [filters]);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    get('/', 
      { category, city: selectedCity }, 
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    get('/', 
      { category: activeCategory, city }, 
      { preserveState: true, preserveScroll: true, replace: true }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCity={selectedCity}
        onCityChange={handleCityChange}
        cities={cities}
      />

      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        
        <EquipmentSection 
          products={products}
          onDetailsClick={setSelectedProductForModal} 
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          selectedCity={selectedCity}
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
