import { Search } from 'lucide-react';


export function SearchBar({ value, onChange }) {
  return (
    <div className="flex-1 max-w-xl mx-8">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ابحث عن معدة للإيجار في اليمن..."
          className="w-full h-12 pr-12 pl-4 rounded-lg border border-border bg-white focus:outline-none focus:border-primary transition-colors text-right"
        />
      </div>
    </div>
  );
}
