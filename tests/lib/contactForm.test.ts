/**
 * Client-side contact form logic: validation, how API responses are turned
 * into success or an error message, and the copy-email helper.
 */
import { describe, expect, it, vi } from 'vitest';
import {
  copyText,
  submitContactForm,
  validateContactForm,
  type ContactPayload,
} from '@lib/contact';

describe('validateContactForm', () => {
  const valid = { name: 'Jane', email: 'jane@example.com', message: 'Hello' };

  it('accepts a complete form', () => {
    expect(validateContactForm(valid)).toEqual({});
  });

  it('flags every missing required field at once', () => {
    expect(validateContactForm({ name: ' ', email: '', message: '\n' })).toEqual({
      name: 'Name is required.',
      email: 'A valid email address is required.',
      message: 'Message is required.',
    });
  });

  it.each(['jane', 'jane@', 'jane@example', 'ja ne@example.com'])('rejects email %j', (email) => {
    expect(validateContactForm({ ...valid, email })).toEqual({
      email: 'A valid email address is required.',
    });
  });
});

describe('submitContactForm', () => {
  const payload: ContactPayload = {
    name: 'Jane',
    email: 'jane@example.com',
    company: '',
    interest: 'Full campaign',
    message: 'Hello',
    website: '',
  };
  const respond = (body: BodyInit, status = 200) =>
    vi.fn<typeof fetch>(async () => new Response(body, { status }));

  it('posts the payload as JSON to /api/contact', async () => {
    const fetchFn = respond(JSON.stringify({ success: true }));
    await submitContactForm(payload, fetchFn);
    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('/api/contact');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(init?.body as string)).toEqual(payload);
  });

  it('reports success', async () => {
    const result = await submitContactForm(payload, respond(JSON.stringify({ success: true })));
    expect(result).toEqual({ ok: true });
  });

  it("passes the server's reason through (e.g. the rate-limit notice)", async () => {
    const body = JSON.stringify({ success: false, message: 'Too many requests.' });
    const result = await submitContactForm(payload, respond(body, 429));
    expect(result).toEqual({ ok: false, message: 'Too many requests.' });
  });

  it('fails with no message on a non-JSON response, like a firewall 429 page', async () => {
    const result = await submitContactForm(payload, respond('Too Many Requests', 429));
    expect(result).toEqual({ ok: false });
  });

  it('fails with no message when the network request throws', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => {
      throw new TypeError('Failed to fetch');
    });
    expect(await submitContactForm(payload, fetchFn)).toEqual({ ok: false });
  });

  it('does not treat a truthy non-boolean success as success', async () => {
    const result = await submitContactForm(payload, respond(JSON.stringify({ success: 'yes' })));
    expect(result).toEqual({ ok: false });
  });
});

describe('copyText', () => {
  it('writes the text and reports success', async () => {
    const writeText = vi.fn(async () => {});
    expect(await copyText('hello@bloq.media', { writeText })).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello@bloq.media');
  });

  it('reports failure when the browser refuses the write', async () => {
    const writeText = vi.fn(async () => {
      throw new DOMException('denied', 'NotAllowedError');
    });
    expect(await copyText('hello@bloq.media', { writeText })).toBe(false);
  });

  it('reports failure when there is no Clipboard API', async () => {
    vi.stubGlobal('navigator', {});
    try {
      expect(await copyText('hello@bloq.media')).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
