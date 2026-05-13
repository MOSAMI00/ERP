/**
 * Formatting utilities — pure JS, no mock dependencies.
 */

/**
 * Calculate rental days between two dates.
 * @param {string} startDate
 * @param {string} endDate
 * @returns {number}
 */
export function calculateRentalDays(startDate, endDate) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format a number as Arabic-Yemen currency.
 * @param {number} value
 * @returns {string}
 */
export function formatCurrency(value) {
  if (value == null) return '—';
  return Math.round(value).toLocaleString('ar-YE');
}

/**
 * Format a date string to Arabic locale.
 * @param {string} value
 * @returns {string}
 */
export function formatRentalDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ar-YE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a rental date range.
 * @param {string} startDate
 * @param {string} endDate
 * @returns {string}
 */
export function formatRentalDateRange(startDate, endDate) {
  return `${formatRentalDate(startDate)} ← ${formatRentalDate(endDate)}`;
}

/**
 * Check if a rental is starting soon (within 2 days).
 * @param {{ startDate: string }} rental
 * @returns {boolean}
 */
export function isRentalStartingSoon(rental) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(rental.startDate);
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
}
