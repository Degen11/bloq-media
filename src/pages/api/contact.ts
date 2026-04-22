import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const TO = ['degen@bloq.media', 'jarrod@bloq.media'];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);

  const name = json?.name?.toString().trim();
  const email = json?.email?.toString().trim();
  const company = json?.company?.toString().trim() || null;
  const message = json?.message?.toString().trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const resend = new Resend(import.meta.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM ?? 'BLOQ Media <noreply@bloq.media>',
    to: TO,
    reply_to: email,
    subject: `New enquiry — ${name}${company ? ` · ${company}` : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <div style="background:#1A3C8F;padding:24px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:20px;margin:0">New enquiry — BLOQ Media website</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;padding:32px;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#6b7280;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Email</td><td style="padding:8px 0"><a href="mailto:${escapeHtml(email)}" style="color:#29ABE2">${escapeHtml(email)}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#6b7280">Company</td><td style="padding:8px 0">${escapeHtml(company)}</td></tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#6b7280;font-size:14px;margin:0 0 8px">Message</p>
          <p style="margin:0;line-height:1.6">${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `,
  });

  if (error) {
    console.error('[contact] Resend error:', error);
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
