import type { APIRoute } from 'astro';

// Per-IP rate limiting — survives within a warm serverless instance
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60_000;

// Upper bounds for each field; anything longer is rejected, not truncated.
// Mirrored by the maxlength attributes in ContactForm.astro.
const MAX_LENGTH = { name: 100, email: 254, company: 100, message: 5000 };
// Same pattern the client-side form uses
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

// Trimmed string, '' when absent, or null when the value isn't a string.
// Single-line fields also have line breaks collapsed to spaces.
function field(value: unknown, singleLine = true): string | null {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return null;
  return (singleLine ? value.replace(/[\r\n]+/g, ' ') : value).trim();
}

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  let body: Record<string, unknown> | null;
  try {
    body = await request.json();
  } catch {
    body = null;
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Honeypot — bots fill this in, humans don't
  if (body.website) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = field(body.name);
  const email = field(body.email);
  const company = field(body.company);
  const message = field(body.message, false);
  if (name === null || email === null || company === null || message === null) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (!name || !email || !message) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  if (
    name.length > MAX_LENGTH.name ||
    email.length > MAX_LENGTH.email ||
    company.length > MAX_LENGTH.company ||
    message.length > MAX_LENGTH.message ||
    !EMAIL_RE.test(email)
  ) {
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid request.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Checked after validation so only well-formed submissions use up the slot
  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Too many requests. Please wait a minute and try again.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const w3Key = import.meta.env.PUBLIC_WEB3FORMS_KEY;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: w3Key,
        subject: 'New enquiry — BLOQ Media website',
        from_name: 'BLOQ Media Website',
        cc: 'degen@bloq.media',
        name,
        email,
        company,
        message,
      }),
    });
    const data = await res.json();
    if (data.success) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch {
    // fall through
  }

  // Nothing was sent, so let the visitor retry straight away
  rateLimitMap.delete(ip);

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Unable to send your message right now. Please email us at hello@bloq.media.',
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};
