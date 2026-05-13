/**
 * Rental status definitions and visual configuration.
 *
 * @typedef {'pending'|'confirmed'|'paid'|'in_use'|'completed'|'cancelled'|'disputed'} RentalStatus
 */

/** @type {Record<string, {label: string, color: string, bg: string}>} */
export const STATUS_CONFIG = {
  pending:   { label: 'معلق',            color: '#F39C12', bg: '#FEF9E7' },
  confirmed: { label: 'مؤكد',            color: '#3498DB', bg: '#EBF5FB' },
  in_use:    { label: 'قيد الاستخدام',   color: '#E67E22', bg: '#FEF5EC' },
  completed: { label: 'مكتمل',           color: '#27AE60', bg: '#EAFAF1' },
  cancelled: { label: 'ملغي',            color: '#95A5A6', bg: '#F2F3F4' },
  disputed:  { label: 'متنازع عليه',     color: '#E74C3C', bg: '#FDEDEC' },
};

/** All possible rental status values. */
export const RENTAL_STATUSES = /** @type {const} */ ([
  'pending', 'confirmed', 'paid', 'in_use', 'completed', 'cancelled', 'disputed',
]);

/**
 * Returns the Arabic label for a rental status.
 * @param {string} status
 * @returns {string}
 */
export function formatRentalStatusLabel(status) {
  return STATUS_CONFIG[status]?.label ?? status;
}

/**
 * Returns the theme colour for a rental status.
 * @param {string} status
 * @returns {string}
 */
export function formatRentalStatusColor(status) {
  return STATUS_CONFIG[status]?.color ?? '#888888';
}

/**
 * Returns the background colour for a rental status badge.
 * @param {string} status
 * @returns {string}
 */
export function formatRentalStatusBg(status) {
  return STATUS_CONFIG[status]?.bg ?? '#F2F3F4';
}
