import * as React from 'react';
import { cn } from '../ui/utils';

const fieldClass =
  'w-full rounded-lg border border-[#E0E0E0] bg-white px-4 text-sm text-[#222222] transition-colors placeholder:text-[#AAAAAA] focus:border-[#2D5A27] focus:outline-none focus:ring-2 focus:ring-[#2D5A27]/10 disabled:cursor-not-allowed disabled:opacity-60';

export function AppInput({ className, ...props }) {
  return <input className={cn(fieldClass, 'h-10', className)} {...props} />;
}

export function AppSelect({ className, ...props }) {
  return <select className={cn(fieldClass, 'h-10 appearance-none', className)} {...props} />;
}

export function AppTextarea({ className, ...props }) {
  return <textarea className={cn(fieldClass, 'min-h-24 py-3 resize-y', className)} {...props} />;
}

export function FieldLabel({ className, ...props }) {
  return <label className={cn('mb-2 block text-sm font-semibold text-[#222222]', className)} {...props} />;
}
