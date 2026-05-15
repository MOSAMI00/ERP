import { Bell, ChevronDown, Menu, Search } from 'lucide-react';

export default function Header({ currentTitle, onOpenSidebar }) {
  return (
    <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 lg:px-6 z-10 w-full">
      <div className="flex items-center space-x-4 space-x-reverse">
        <button
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          onClick={onOpenSidebar}
        >
          <Menu size={24} />
        </button>
        <h2 className="text-xl lg:text-2xl font-bold text-brand-text-primary hidden sm:block">{currentTitle}</h2>
      </div>

      <div className="flex items-center space-x-4 lg:space-x-6 space-x-reverse">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="بحث..."
            className="pl-4 pr-10 py-2 rounded-lg border border-brand-border focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary w-48 lg:w-64 bg-brand-content"
          />
          <Search className="absolute right-3 top-2.5 text-brand-text-muted" size={20} />
        </div>

        <button className="relative p-2 text-brand-text-primary hover:bg-brand-content rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-1 right-1 w-4 h-4 bg-brand-danger text-white text-[10px] flex items-center justify-center font-bold rounded-full border-2 border-white">3</span>
        </button>

        <div className="flex items-center space-x-3 space-x-reverse cursor-pointer border-r border-brand-border pr-4 lg:pr-6">
          <img
            src="https://ui-avatars.com/api/?name=Admin+User&background=2D5A27&color=fff"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-brand-primary/20"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-brand-text-primary flex items-center gap-1">أحمد علي <ChevronDown size={14} className="text-brand-text-muted" /></p>
          </div>
        </div>
      </div>
    </header>
  );
}
