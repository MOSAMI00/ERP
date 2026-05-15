export default function WarningBanner({ icon: Icon, title, description }) {
  return (
    <div className="bg-brand-sidebar text-white rounded-xl p-4 shadow-md flex items-center space-x-4 space-x-reverse border border-brand-sidebar">
      {Icon && (
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
          <Icon size={20} className="text-white" />
        </div>
      )}
      <div>
        <h4 className="font-bold">{title}</h4>
        {description && <p className="text-xs text-white/70 mt-1">{description}</p>}
      </div>
    </div>
  );
}
