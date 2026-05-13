import { cn } from '../ui/utils';

export function formatDisplayDate(value?: string | null) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ar-YE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function DateRangeText({
  start,
  end,
  className,
}) {
  return <span className={cn('whitespace-nowrap', className)}>{formatDisplayDate(start)} - {formatDisplayDate(end)}</span>;
}
