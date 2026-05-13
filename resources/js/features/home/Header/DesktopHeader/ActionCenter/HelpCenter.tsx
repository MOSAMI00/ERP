import { HelpCircle } from 'lucide-react';

export function HelpCenter() {
  return (
    <button className="p-2 rounded-lg hover:bg-muted transition-colors group">
      <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
}
