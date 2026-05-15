export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="py-12 px-6 text-center text-brand-text-muted">
      {Icon && (
        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-brand-content flex items-center justify-center">
          <Icon size={24} />
        </div>
      )}
      <h3 className="font-bold text-brand-text-primary mb-1">{title}</h3>
      {description && <p className="text-sm">{description}</p>}
    </div>
  );
}
