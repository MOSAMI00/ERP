import { cn } from '../ui/utils';

export function formatMoney(value?: number | string | null) {
  const numeric = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (numeric === null || numeric === undefined || Number.isNaN(Number(numeric))) return '—';
  return Math.round(Number(numeric)).toLocaleString('ar-YE');
}

export function MoneyText({
  value,
  currency = 'ر.ي',
  className,
}) {
  return <span className={cn('whitespace-nowrap', className)}>{formatMoney(value)} {currency}</span>;
}
