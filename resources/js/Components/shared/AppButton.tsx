import * as React from 'react';
import { cn } from '../ui/utils';

const variantClasses = {
  primary: 'bg-[#2D5A27] text-white border border-[#2D5A27] hover:bg-[#245020]',
  outline: 'bg-white text-[#222222] border border-[#E0E0E0] hover:bg-[#F4F6F9]',
  success: 'bg-[#27AE60] text-white border border-[#27AE60] hover:bg-[#219A52]',
  danger: 'bg-[#E74C3C] text-white border border-[#E74C3C] hover:bg-[#C0392B]',
  ghost: 'bg-transparent text-[#222222] border border-transparent hover:bg-[#F4F6F9]',
};

const sizeClasses = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-9 w-9 p-0',
};

export function AppButton({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
