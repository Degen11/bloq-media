/**
 * Fixed-window, per-key rate limiter kept in memory.
 *
 * On Vercel each serverless instance has its own copy, so this only slows down
 * repeat submissions that land on the same warm instance. It is a courtesy
 * limit, not the abuse guard: that has to live in front of the function (a
 * Vercel Firewall rate-limit rule on POST /api/contact).
 */
export interface RateLimiter {
  /** True if `key` may proceed now (and records the hit), false if limited. */
  check(key: string): boolean;
  /** Forget `key`, e.g. when the request it allowed didn't go through. */
  release(key: string): void;
  /** Number of keys currently tracked. */
  readonly size: number;
}

export function createRateLimiter({
  windowMs,
  maxEntries,
}: {
  windowMs: number;
  /** Once more keys than this are tracked, expired ones are swept out. */
  maxEntries: number;
}): RateLimiter {
  const hits = new Map<string, number>();
  return {
    check(key) {
      const now = Date.now();
      const last = hits.get(key);
      if (last !== undefined && now - last < windowMs) return false;
      hits.set(key, now);
      if (hits.size > maxEntries) {
        for (const [k, time] of hits) {
          if (now - time >= windowMs) hits.delete(k);
        }
      }
      return true;
    },
    release(key) {
      hits.delete(key);
    },
    get size() {
      return hits.size;
    },
  };
}

/** The client IP from `x-forwarded-for` (first hop), or 'unknown'. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
}
