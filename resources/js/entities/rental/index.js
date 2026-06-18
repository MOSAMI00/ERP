/**
 * Rental entity — public API.
 *
 * Re-exports every rental-related constant, helper, and type-def so consumers
 * can `import { STATUS_CONFIG, formatRentalNumber } from '@/app/entities/rental'`.
 */
export {
  STATUS_CONFIG,
  RENTAL_STATUSES,
  formatRentalStatusLabel,
  formatRentalStatusColor,
  formatRentalStatusBg,
} from './status';

export {
  formatRentalNumber,
  formatTimelineDate,
  getRentalStatusConfig,
} from './constants';

/**
 * Tab definitions for rental list filters.
 * @type {Array<{key: string, label: string}>}
 */
export const RENTAL_TABS = [
  { key: 'all',       label: 'الكل' },
  { key: 'pending',   label: 'معلقة' },
  { key: 'confirmed', label: 'مؤكدة' },
  { key: 'in_use',    label: 'قيد الاستخدام' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'cancelled', label: 'ملغية' },
  { key: 'disputed',  label: 'نزاعات' },
];
