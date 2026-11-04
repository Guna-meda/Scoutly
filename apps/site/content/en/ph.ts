import type { PlaceholderKey } from './schema';

/** Marker string for a not-yet-supplied value. Rendered visibly; `check:launch` fails on it. */
export function ph<K extends PlaceholderKey>(key: K): `«PH:${K}»` {
  return `«PH:${key}»`;
}
