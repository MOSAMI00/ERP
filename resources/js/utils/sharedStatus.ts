import type { SharedStatus } from '@/types/inertia';

export const enumValue = (value: unknown, fallback = ''): string => {
  if (!value) return fallback;
  if (typeof value === 'object' && value !== null) {
    const item = value as { value?: string; name?: string };
    return item.value ?? item.name ?? fallback;
  }
  return String(value);
};

export const statusMap = (statuses: SharedStatus[] = []) =>
  Object.fromEntries(statuses.map((status) => [status.value, status]));

export const statusLabel = (statuses: SharedStatus[] = [], value: unknown, fallback = 'غير محدد') => {
  const key = enumValue(value);
  return statusMap(statuses)[key]?.label ?? key ?? fallback;
};
