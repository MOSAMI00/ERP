const variants = {
  primary: 'bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90',
  secondary: 'bg-white text-brand-text-primary border-brand-border hover:bg-gray-50',
  ghost: 'bg-transparent text-brand-text-muted border-transparent hover:bg-brand-content hover:text-brand-text-primary',
  danger: 'bg-brand-danger text-white border-brand-danger hover:bg-brand-danger/90',
  success: 'bg-brand-success text-white border-brand-success hover:bg-brand-success/90',
  warning: 'bg-brand-warning text-white border-brand-warning hover:bg-brand-warning/90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  unstyled = false,
  type = 'button',
  ...props
}) {
  const classes = unstyled
    ? className
    : `inline-flex items-center justify-center rounded-lg border font-bold transition-colors ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}
