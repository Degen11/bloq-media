// Contact form rules shared by the client-side form (ContactForm.astro) and
// the API route (pages/api/contact.ts), so the two can't drift apart.

/** Upper bounds for each field; longer values are rejected, not truncated. */
export const MAX_LENGTH = { name: 100, email: 254, company: 100, message: 5000 } as const;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
