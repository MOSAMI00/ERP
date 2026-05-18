import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export function HelpCenter() {
  return (
    <Link 
      href="/policies" 
      className="p-2 rounded-lg hover:bg-muted transition-colors group flex items-center justify-center"
      title="سياسة الاستخدام والإلغاء"
    >
      <HelpCircle className="w-5 h-5 text-muted-foreground group-hover:text-[#2D5A27] transition-colors" />
    </Link>
  );
}
