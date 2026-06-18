import { router } from '@inertiajs/react';

/**
 * Navigate to a route using Inertia router.
 * Falls back to window.location if Inertia router is unavailable.
 * @param {string} path — route path or named route via route()
 * @param {object} [options]
 */
export function visit(path, options = {}) {
  try {
    return router.visit(path, { preserveScroll: true, ...options });
  } catch {
    window.location.assign(path);
    return null;
  }
}

/**
 * Navigate using GET (for filtered/search views).
 * @param {string} path
 * @param {object} [data]
 * @param {object} [options]
 */
export function get(path, data = {}, options = {}) {
  try {
    return router.get(path, data, { preserveScroll: true, ...options });
  } catch {
    const params = new URLSearchParams(data).toString();
    window.location.assign(params ? `${path}?${params}` : path);
    return null;
  }
}
