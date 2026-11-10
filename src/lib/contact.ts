// Contact form rules shared by the client-side form (ContactForm.astro) and
// the API route (pages/api/contact.ts), so the two can't drift apart.

/** Upper bounds for each field; longer values are rejected, not truncated. */
export const MAX_LENGTH = { name: 100, email: 254, company: 100, message: 5000 } as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Options for the form's optional "What do you need?" picker. */
export const INTERESTS = [
  'Content strategy',
  'Digital marketing',
  'Thought leadership',
  'Full campaign',
] as const;

export type RequiredField = 'name' | 'email' | 'message';

/** Client-side check of the required fields; returns a message per bad field. */
export function validateContactForm(values: Record<RequiredField, string>) {
  const errors: Partial<Record<RequiredField, string>> = {};
  if (!values.name.trim()) errors.name = 'Name is required.';
  const email = values.email.trim();
  if (!email || !EMAIL_RE.test(email)) errors.email = 'A valid email address is required.';
  if (!values.message.trim()) errors.message = 'Message is required.';
  return errors;
}

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  interest: string;
  message: string;
  /** Honeypot; empty for real visitors. */
  website: string;
}

export type SubmitResult =
  | { ok: true }
  /** `message` is the server's reason (e.g. the rate-limit notice), when it gave one. */
  | { ok: false; message?: string };

/**
 * POST the form to /api/contact and boil the response down to success, or
 * failure with the server's message. Network errors and non-JSON responses
 * (e.g. a 429 from the Vercel Firewall) come back as a failure with no message.
 */
export async function submitContactForm(
  payload: ContactPayload,
  fetchFn: typeof fetch = fetch,
): Promise<SubmitResult> {
  try {
    const res = await fetchFn('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    const data: unknown = await res.json();
    if (typeof data === 'object' && data !== null) {
      const { success, message } = data as { success?: unknown; message?: unknown };
      if (success === true) return { ok: true };
      if (typeof message === 'string') return { ok: false, message };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}

/**
 * Copy text with the Clipboard API. Returns false when the API is missing or
 * the write is refused, so the caller can fall back (the form opens mailto:).
 */
export async function copyText(
  text: string,
  clipboard: Pick<Clipboard, 'writeText'> | undefined = globalThis.navigator?.clipboard,
): Promise<boolean> {
  if (!clipboard) return false;
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
