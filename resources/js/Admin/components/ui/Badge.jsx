const variants = {
  success: 'bg-brand-success/10 text-brand-success',
  warning: 'bg-brand-warning/10 text-brand-warning',
  danger: 'bg-brand-danger/10 text-brand-danger',
  info: 'bg-brand-info/10 text-brand-info',
  neutral: 'bg-brand-content text-brand-text-muted',
};

export default function Badge({ children, variant = 'neutral', className = '', unstyled = false }) {
  return (
    <span className={unstyled ? className : `px-2.5 py-1 rounded-md text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
