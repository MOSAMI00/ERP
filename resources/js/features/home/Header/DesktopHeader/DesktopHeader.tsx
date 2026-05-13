import { LogoSection } from './LogoSection';
import { SearchBar } from './SearchBar';
import { ActionCenter } from './ActionCenter/ActionCenter';


export function DesktopHeader({ searchQuery, onSearchChange }) {
  return (
    <div className="hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px]">
          <LogoSection />
          <SearchBar value={searchQuery} onChange={onSearchChange} />
          <ActionCenter />
        </div>
      </div>
    </div>
  );
}

