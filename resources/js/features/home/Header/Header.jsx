import { useState } from 'react';
import { TopBar } from './TopBar/TopBar';
import { DesktopHeader } from './DesktopHeader/DesktopHeader';
import { MobileHeader } from './MobileHeader/MobileHeader';
import { MobileDrawer } from './MobileDrawer/MobileDrawer';
import { CategoryStrip } from './CategoryStrip/CategoryStrip';


export function Header({ activeCategory, onCategoryChange, searchQuery, onSearchChange }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationCount = 3;

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <DesktopHeader searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <MobileHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          notificationCount={notificationCount}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
        <MobileDrawer
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
      <CategoryStrip 
        activeCategory={activeCategory} 
        onCategoryChange={onCategoryChange} 
      />
    </>
  );
}
