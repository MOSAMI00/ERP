import { Search, Filter } from 'lucide-react';


export function SearchBar({ search, onSearchChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
        <input
          type="text"
          placeholder="بحث في الطلبات..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#E0E0E0] bg-white text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
        />
      </div>
      <button className="h-10 px-4 rounded-xl border border-[#E0E0E0] bg-white flex items-center gap-2 text-sm text-[#888888] hover:border-[#2D5A27] transition-colors">
        <Filter className="w-4 h-4" />
        <span className="hidden sm:inline">فلتر</span>
      </button>
    </div>
  );
}
