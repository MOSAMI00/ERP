import { LogoSection } from './LogoSection';
import { SearchBar } from './SearchBar';
import { ActionCenter } from './ActionCenter/ActionCenter';


export function DesktopHeader({ 
  searchQuery, 
  onSearchChange,
  selectedCity,
  onCityChange,
  cities = []
}) {
  return (
    <div className="hidden md:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-[72px] gap-4">
          <LogoSection />
          <div className="flex-1 flex items-center gap-4">
            <SearchBar value={searchQuery} onChange={onSearchChange} />
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="h-12 px-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors text-right min-w-[140px] font-medium"
            >
              <option value="الكل">كل المدن</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <ActionCenter />
        </div>
      </div>
    </div>
  );
}

