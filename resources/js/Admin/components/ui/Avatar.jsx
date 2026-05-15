const sizes = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-20 h-20',
};

export default function Avatar({ name, size = 'md', className = '' }) {
  const src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D5A27&color=fff`;

  return (
    <img
      src={src}
      alt={name}
      className={`${sizes[size]} rounded-full border border-brand-border ${className}`}
    />
  );
}
