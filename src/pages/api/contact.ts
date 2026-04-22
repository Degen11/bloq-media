import type { APIRoute } from 'astro';

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

export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ success: false, message: 'Too many requests — please wait a minute.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
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

  const { name, email, company, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return new Response(
      JSON.stringify({ success: false, message: 'Missing required fields.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
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
        company: company ?? '',
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

  return new Response(
    JSON.stringify({
      success: false,
      message: 'Unable to send your message right now. Please reach us on social media.',
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
};
