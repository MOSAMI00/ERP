import * as React from 'react';
import { cn } from '../ui/utils';

const STATUS_META = {
  pending: { label: 'بانتظار', color: '#F39C12', bg: 'rgba(243,156,18,0.12)' },
  confirmed: { label: 'مؤكد', color: '#3498DB', bg: 'rgba(52,152,219,0.12)' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: 'rgba(230,126,34,0.12)' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  cancelled: { label: 'ملغي', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
  disputed: { label: 'نزاع', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  active: { label: 'نشط', color: '#27AE60', bg: '#EAFAF1' },
  expired: { label: 'منتهي', color: '#95A5A6', bg: '#F2F3F4' },
  available: { label: 'متاح', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  reserved: { label: 'محجوز', color: '#F39C12', bg: 'rgba(243,156,18,0.12)' },
  hidden: { label: 'مخفي', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
  paid: { label: 'مدفوع', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
  unpaid: { label: 'غير مدفوع', color: '#F39C12', bg: 'rgba(243,156,18,0.12)' },
  refunded: { label: 'مسترد', color: '#95A5A6', bg: 'rgba(149,165,166,0.12)' },
};

export function getStatusMeta(status, meta) {
  const key = status ?? 'unknown';
  const fallback = STATUS_META[key] ?? {
    label: status || 'غير معروف',
    color: '#95A5A6',
    bg: 'rgba(149,165,166,0.12)',
  };

  return { ...fallback, ...meta };
}

export function StatusBadge({ status, label, meta, className }) {
  const resolved = getStatusMeta(status, meta);

  return (
    <span
      className={cn('inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold', className)}
      style={{ color: resolved.color, backgroundColor: resolved.bg }}
    >
      {label ?? resolved.label}
    </span>
  );
}
