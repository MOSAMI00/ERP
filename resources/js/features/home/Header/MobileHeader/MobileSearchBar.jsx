import { Search } from 'lucide-react';


export function MobileSearchBar({ value, onChange }) {
  return (
    <div className="p-3 border-b border-border">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ابحث عن معدة في اليمن..."
          className="w-full h-11 pr-11 pl-3 rounded-lg border border-border bg-white focus:outline-none focus:border-primary text-right"
        />
      </div>
    </div>
  );
}
