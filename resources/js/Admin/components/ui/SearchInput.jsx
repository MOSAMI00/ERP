import { Search } from 'lucide-react';

export default function SearchInput({ value, onChange, placeholder, className = '', inputClassName = 'w-full pl-4 pr-10 py-2 rounded-lg border border-brand-border bg-brand-content focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm' }) {
  return (
    <div className={`relative ${className}`}>
      <input 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputClassName}
      />
      <Search className="absolute right-3 top-2.5 text-brand-text-muted" size={18} />
    </div>
  );
}
