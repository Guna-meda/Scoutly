import { createHash } from 'node:crypto';

/**
 * Sliding-window limiter, in memory. It is per server instance: with several instances the real
 * limit is higher. Production needs a shared store (see README "Waitlist storage").
 */
export class SlidingWindow {
  private hits = new Map<string, number[]>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  /** Returns true when the call is allowed (and records it). */
  allow(key: string, now = Date.now()): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) {
      for (const [k, v] of this.hits) {
        if (v.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
      }
    }
    return true;
  }
}

/** Salted hash so raw IPs and emails are never stored in memory keys or logs. */
export function hashKey(value: string, salt = process.env.RATE_LIMIT_SALT ?? 'dev-salt'): string {
  return createHash('sha256').update(`${salt}:${value}`).digest('hex');
}
