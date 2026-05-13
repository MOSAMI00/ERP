import { MainBar } from './MainBar';
import { MobileSearchBar } from './MobileSearchBar';


export function MobileHeader({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  notificationCount,
  searchQuery,
  onSearchChange
}) {
  return (
    <div className="md:hidden">
      <MainBar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        notificationCount={notificationCount} 
      />
      <MobileSearchBar value={searchQuery} onChange={onSearchChange} />
    </div>
  );
}

