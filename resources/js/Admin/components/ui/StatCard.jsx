const colorClasses = {
  primary: 'bg-brand-primary/10 text-brand-primary',
  success: 'bg-brand-success/10 text-brand-success',
  warning: 'bg-brand-warning/10 text-brand-warning',
  danger: 'bg-brand-danger/10 text-brand-danger',
  info: 'bg-brand-info/10 text-brand-info',
};

const changeClasses = {
  success: 'text-brand-success',
  warning: 'text-brand-warning',
  danger: 'text-brand-danger',
  info: 'text-brand-info',
  neutral: 'text-brand-text-muted',
};

export default function StatCard({
  title,
  value,
  unit,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'primary',
  sparkline,
}) {
  return (
    <div className="bg-brand-card rounded-xl p-6 border border-brand-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        )}
        {change && <span className={`text-sm font-bold ${changeClasses[changeType]}`}>{change}</span>}
      </div>
      <div>
        <p className="text-brand-text-muted text-sm mb-1">{title}</p>
        <p className="text-[32px] font-bold text-brand-text-primary leading-none">{value} {unit && <span className="text-base font-normal text-brand-text-muted">{unit}</span>}</p>
      </div>
      {sparkline}
    </div>
  );
}
