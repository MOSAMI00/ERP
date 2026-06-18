/**
 * Equipment entity — domain shapes and helpers.
 *
 * @typedef {Object} EquipmentSnapshot
 * @property {number}  id
 * @property {string}  name
 * @property {string}  category
 * @property {string}  image
 * @property {string}  location
 * @property {number}  pricePerDay
 * @property {number}  rating
 * @property {string}  ownerName
 * @property {string}  ownerId
 * @property {string}  description
 * @property {boolean} isAvailable
 *
 * @typedef {Object} EquipmentSummary
 * @property {number|string} [id]
 * @property {number}        [equipmentId]
 * @property {string}        [name]
 * @property {string}        [image]
 * @property {string}        [location]
 * @property {string}        [category]
 */

/** Equipment categories. */
export const EQUIPMENT_CATEGORIES = [
  'حفر وتنقيب',
  'رفع ونقل',
  'خلط وصب',
  'ضغط وتمهيد',
  'قطع وتكسير',
  'كهربائية',
  'سباكة',
  'أخرى',
];

/**
 * Formats equipment title for display, truncating if too long.
 * @param {string} name
 * @param {number} [maxLen=40]
 * @returns {string}
 */
export function formatEquipmentTitle(name, maxLen = 40) {
  if (!name) return '—';
  return name.length > maxLen ? name.slice(0, maxLen) + '…' : name;
}

/**
 * Formats price per day with currency.
 * @param {number} pricePerDay
 * @returns {string}
 */
export function formatEquipmentPricePerDay(pricePerDay) {
  if (pricePerDay == null) return '—';
  return `${pricePerDay.toLocaleString('ar-SA')} ر.س / يوم`;
}
