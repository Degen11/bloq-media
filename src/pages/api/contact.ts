import type { APIRoute } from 'astro';
import { EMAIL_RE, MAX_LENGTH } from '@lib/contact';
import { CONTACT_EMAIL, SITE_NAME, TEAM_EMAIL } from '@lib/site';

// Per-IP rate limiting — survives within a warm serverless instance
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const last = rateLimitMap.get(ip);
  if (last && now - last < RATE_LIMIT_MS) return false;
  rateLimitMap.set(ip, now);
  if (rateLimitMap.size > 500) {
    for (const [key, time] of rateLimitMap) {
      if (now - time > RATE_LIMIT_MS) rateLimitMap.delete(key);
    }
  }
  return true;
}

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const fail = (message: string, status: number) => json({ success: false, message }, status);

// Trimmed string, '' when absent, or null when the value isn't a string.
// Single-line fields also have line breaks collapsed to spaces.
function field(value: unknown, singleLine = true): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  return (singleLine ? value.replace(/[\r\n]+/g, ' ') : value).trim();
}

export const POST: APIRoute = async ({ request }) => {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return fail('Invalid request.', 400);
  }

  // Honeypot — bots fill this in, humans don't
  if (body.website) {
    return json({ success: true });
  }

  const name = field(body.name);
  const email = field(body.email);
  const company = field(body.company);
  const message = field(body.message, false);
  if (name === null || email === null || company === null || message === null) {
    return fail('Invalid request.', 400);
  }
  if (!name || !email || !message) {
    return fail('Missing required fields.', 400);
  }
  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    company.length > MAX_LENGTH.company ||
    message.length > MAX_LENGTH.message ||
    !EMAIL_RE.test(email)
  ) {
    return fail('Invalid request.', 400);
  }

  // Checked after validation so only well-formed submissions use up the slot
  if (!checkRateLimit(ip)) {
    return fail('Too many requests. Please wait a minute and try again.', 429);
  }

  const w3Key = import.meta.env.PUBLIC_WEB3FORMS_KEY;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: w3Key,
        subject: `New inquiry — ${SITE_NAME} website`,
        from_name: `${SITE_NAME} Website`,
        cc: TEAM_EMAIL,
        name,
        email,
        company,
        message,
      }),
    });
    const data = await res.json();
    if (data.success) {
      return json({ success: true });
    }
  } catch {
    // fall through
  }

  // Nothing was sent, so let the visitor retry straight away
  rateLimitMap.delete(ip);

  return fail(`Unable to send your message right now. Please email us at ${CONTACT_EMAIL}.`, 500);
};
