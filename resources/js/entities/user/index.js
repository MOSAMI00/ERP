/**
 * User entity — domain shapes for tenants and owners.
 *
 * @typedef {Object} User
 * @property {string}  id
 * @property {string}  fullName
 * @property {string}  phone
 * @property {string}  email
 * @property {'tenant'|'owner'} role
 *
 * @typedef {Object} TenantProfile
 * @property {string}  id
 * @property {string}  name
 * @property {string}  phone
 * @property {string}  [avatarUrl]
 * @property {number}  [rating]
 * @property {number}  [completedRentalsCount]
 *
 * @typedef {Object} OwnerProfile
 * @property {string}  id
 * @property {string}  name
 * @property {string}  phone
 * @property {string}  [avatarUrl]
 * @property {number}  [rating]
 * @property {number}  [totalEquipment]
 * @property {number}  [totalRentals]
 */

/**
 * Returns the user's initial character (for avatars).
 * @param {User|null|undefined} user
 * @returns {string}
 */
export function getUserInitial(user) {
  return (user?.fullName ?? '؟').charAt(0);
}

/**
 * Returns a display-friendly user name, or a fallback.
 * @param {User|null|undefined} user
 * @returns {string}
 */
export function getUserDisplayName(user) {
  return user?.fullName ?? 'مستخدم';
}
