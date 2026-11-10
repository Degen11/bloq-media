/**
 * In-memory rate limiter used by POST /api/contact: window expiry, eviction
 * of stale entries, and client IP parsing.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clientIp, createRateLimiter } from '@lib/rateLimit';

describe('createRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('blocks a key inside the window and lets it back in once the window has passed', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxEntries: 500 });
    expect(limiter.check('1.1.1.1')).toBe(true);

    vi.advanceTimersByTime(59_999);
    expect(limiter.check('1.1.1.1')).toBe(false);

    vi.advanceTimersByTime(1);
    expect(limiter.check('1.1.1.1')).toBe(true);
  });

  it('a blocked attempt does not restart the window', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxEntries: 500 });
    limiter.check('a');
    vi.advanceTimersByTime(30_000);
    expect(limiter.check('a')).toBe(false);
    vi.advanceTimersByTime(30_000);
    expect(limiter.check('a')).toBe(true);
  });

  it('release() frees a key straight away', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxEntries: 500 });
    limiter.check('a');
    limiter.release('a');
    expect(limiter.check('a')).toBe(true);
  });

  it('sweeps expired keys once it tracks more than maxEntries', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxEntries: 500 });
    for (let i = 0; i < 500; i++) limiter.check(`old-${i}`);
    expect(limiter.size).toBe(500);

    vi.advanceTimersByTime(60_000);
    limiter.check('new-0');
    // 501 keys tracked, so the sweep runs and drops the 500 expired ones
    expect(limiter.size).toBe(1);
  });

  it('keeps keys that are still inside their window when sweeping', () => {
    const limiter = createRateLimiter({ windowMs: 60_000, maxEntries: 3 });
    limiter.check('old');
    vi.advanceTimersByTime(60_000);
    limiter.check('a');
    limiter.check('b');
    limiter.check('c');
    expect(limiter.size).toBe(3);
    expect(limiter.check('a')).toBe(false);
  });
});

describe('clientIp', () => {
  it('uses the first address of a comma-separated x-forwarded-for', () => {
    const headers = new Headers({ 'x-forwarded-for': '203.0.113.7, 10.0.0.1, 10.0.0.2' });
    expect(clientIp(headers)).toBe('203.0.113.7');
  });

  it('trims whitespace around a single address', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '  198.51.100.4 ' }))).toBe('198.51.100.4');
  });

  it("falls back to 'unknown' when the header is missing or empty", () => {
    expect(clientIp(new Headers())).toBe('unknown');
    expect(clientIp(new Headers({ 'x-forwarded-for': '' }))).toBe('unknown');
  });
});
