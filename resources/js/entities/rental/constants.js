/**
 * Rental formatting utilities.
 */
import { STATUS_CONFIG } from './status';

/**
 * Formats a rental order number for display.
 * @param {{ orderNum?: string }} rental
 * @returns {string}
 */
export function formatRentalNumber(rental) {
  return rental?.orderNum ? `#${rental.orderNum}` : '—';
}

/**
 * Formats a date string to Arabic locale date.
 * @param {string} dateStr
 * @returns {string}
 */
export function formatTimelineDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Returns the full status config (label + colour + bg) for a given status.
 * @param {string} status
 * @returns {{ label: string, color: string, bg: string }}
 */
export function getRentalStatusConfig(status) {
  return STATUS_CONFIG[status] ?? { label: status, color: '#888', bg: '#F2F3F4' };
}
