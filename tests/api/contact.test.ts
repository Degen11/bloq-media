/**
 * Contact form API endpoint unit tests.
 * Issues covered: honeypot detection, rate limiting, field validation
 * (types, lengths, email format),
 * Web3Forms integration, and correct HTTP status codes.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '../../src/pages/api/contact';

// Build a minimal Astro-compatible context
function makeCtx(body: Record<string, unknown>, ip = `test-${Math.random()}`) {
  const request = new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
  return { request } as Parameters<typeof POST>[0];
}

const validBody = {
  name: 'Jane Smith',
  email: 'jane@example.com',
  company: 'Acme',
  message: 'Hello, I am interested in your services.',
  website: '', // honeypot — must be empty
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// ---------------------------------------------------------------------------
// Honeypot
// ---------------------------------------------------------------------------
describe('honeypot', () => {
  it('silently returns 200 when honeypot field is filled (bots)', async () => {
    const res = await POST(makeCtx({ ...validBody, website: 'http://spam.com' }));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it('does NOT call Web3Forms when honeypot is triggered', async () => {
    await POST(makeCtx({ ...validBody, website: 'filled' }));
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('proceeds normally when honeypot is empty', async () => {
    const res = await POST(makeCtx(validBody));
    expect(res.status).toBe(200);
    expect(vi.mocked(fetch)).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------
describe('rate limiting', () => {
  it('returns 429 on second request from same IP within 60s', async () => {
    const ip = `rate-limit-test-${Math.random()}`;
    const first = await POST(makeCtx(validBody, ip));
    expect(first.status).toBe(200);

    const second = await POST(makeCtx(validBody, ip));
    expect(second.status).toBe(429);
  });

  it('rate limit response has correct message', async () => {
    const ip = `rate-limit-msg-${Math.random()}`;
    await POST(makeCtx(validBody, ip));
    const res = await POST(makeCtx(validBody, ip));
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.message).toMatch(/too many/i);
  });

  it('invalid submissions do not use up the rate limit', async () => {
    const ip = `rate-limit-invalid-${Math.random()}`;
    const bad = await POST(makeCtx({ ...validBody, email: '' }, ip));
    expect(bad.status).toBe(400);
    const good = await POST(makeCtx(validBody, ip));
    expect(good.status).toBe(200);
  });

  it('allows an immediate retry when Web3Forms fails', async () => {
    const ip = `rate-limit-retry-${Math.random()}`;
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    const failed = await POST(makeCtx(validBody, ip));
    expect(failed.status).toBe(500);
    const retry = await POST(makeCtx(validBody, ip));
    expect(retry.status).toBe(200);
  });

  it('allows different IPs to submit independently', async () => {
    const ip1 = `ip-a-${Math.random()}`;
    const ip2 = `ip-b-${Math.random()}`;
    const r1 = await POST(makeCtx(validBody, ip1));
    const r2 = await POST(makeCtx(validBody, ip2));
    expect(r1.status).toBe(200);
    expect(r2.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------
describe('field validation', () => {
  it('returns 400 when name is missing', async () => {
    const { name: _, ...rest } = validBody;
    const res = await POST(makeCtx({ ...rest, name: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeCtx({ ...validBody, email: '' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 when message is missing', async () => {
    const res = await POST(makeCtx({ ...validBody, message: '   ' }));
    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid JSON body', async () => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '9.9.9.9' },
      body: 'not-json',
    });
    const res = await POST({ request } as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
  });

  it.each([
    ['null', 'null'],
    ['an array', '[]'],
    ['a string', '"hello"'],
  ])('returns 400 when the body is %s', async (_, raw) => {
    const request = new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `raw-${Math.random()}` },
      body: raw,
    });
    const res = await POST({ request } as Parameters<typeof POST>[0]);
    expect(res.status).toBe(400);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it.each(['name', 'email', 'company', 'message'])(
    'returns 400 when %s is not a string',
    async (key) => {
      const res = await POST(makeCtx({ ...validBody, [key]: { trim: 1 } }));
      expect(res.status).toBe(400);
      expect(vi.mocked(fetch)).not.toHaveBeenCalled();
    },
  );

  it('returns 400 for a malformed email', async () => {
    const res = await POST(makeCtx({ ...validBody, email: 'not-an-email' }));
    expect(res.status).toBe(400);
  });

  it.each([
    ['name', 101],
    ['email', 255],
    ['company', 101],
    ['message', 5001],
  ])('returns 400 when %s is longer than the limit', async (key, len) => {
    const value = key === 'email' ? `${'a'.repeat(len - 12)}@example.com` : 'a'.repeat(len);
    const res = await POST(makeCtx({ ...validBody, [key]: value }));
    expect(res.status).toBe(400);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it('accepts fields exactly at the limit', async () => {
    const res = await POST(
      makeCtx({
        ...validBody,
        name: 'a'.repeat(100),
        email: `${'a'.repeat(242)}@example.com`,
        company: 'a'.repeat(100),
        message: 'a'.repeat(5000),
      }),
    );
    expect(res.status).toBe(200);
  });

  it('collapses line breaks in single-line fields but keeps them in the message', async () => {
    await POST(
      makeCtx({ ...validBody, name: 'Jane\r\nBcc: x@evil.test', message: 'Line 1\nLine 2' }),
    );
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    const sent = JSON.parse(opts.body as string);
    expect(sent.name).toBe('Jane Bcc: x@evil.test');
    expect(sent.message).toBe('Line 1\nLine 2');
  });

  it('company field is optional', async () => {
    const { company: _, ...rest } = validBody;
    const res = await POST(makeCtx(rest));
    expect(res.status).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Web3Forms integration
// ---------------------------------------------------------------------------
describe('Web3Forms forwarding', () => {
  it('calls Web3Forms with required fields', async () => {
    await POST(makeCtx(validBody));
    expect(vi.mocked(fetch)).toHaveBeenCalledOnce();
    const [url, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('web3forms.com');
    const sent = JSON.parse(opts.body as string);
    expect(sent.name).toBe(validBody.name);
    expect(sent.email).toBe(validBody.email);
    expect(sent.message).toBe(validBody.message);
  });

  it('returns 500 when Web3Forms returns success: false', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      json: async () => ({ success: false, message: 'invalid key' }),
    } as Response);
    const res = await POST(makeCtx(validBody));
    expect(res.status).toBe(500);
  });

  it('returns 500 when Web3Forms throws a network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    const res = await POST(makeCtx(validBody));
    expect(res.status).toBe(500);
  });

  it('all responses include Content-Type: application/json', async () => {
    const res = await POST(makeCtx(validBody));
    expect(res.headers.get('Content-Type')).toBe('application/json');
  });
});

// ---------------------------------------------------------------------------
// Optional "What do you need?" picker
// ---------------------------------------------------------------------------
describe('interest field', () => {
  it('is optional and forwarded as "Not specified" when absent', async () => {
    const res = await POST(makeCtx(validBody));
    expect(res.status).toBe(200);
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(opts.body as string).interest).toBe('Not specified');
  });

  it('forwards a listed option', async () => {
    const res = await POST(makeCtx({ ...validBody, interest: 'Full campaign' }));
    expect(res.status).toBe(200);
    const [, opts] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(JSON.parse(opts.body as string).interest).toBe('Full campaign');
  });

  it('rejects a value that is not one of the options', async () => {
    const res = await POST(makeCtx({ ...validBody, interest: 'Free money' }));
    expect(res.status).toBe(400);
  });

  it('rejects a non-string value', async () => {
    const res = await POST(makeCtx({ ...validBody, interest: ['Full campaign'] }));
    expect(res.status).toBe(400);
  });
});
