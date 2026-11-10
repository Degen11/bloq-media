/**
 * Accessibility checks via static source analysis.
 * Issues covered: aria-required, aria-describedby, aria-invalid support,
 * role=alert on error regions, aria-hidden on decorative SVGs.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

// The opening tag of the element with the given id, so each assertion checks
// that element's own attributes instead of matching anywhere in the file.
const openingTag = (src: string, id: string): string => {
  const match = src.match(new RegExp(`<[a-z]+\\b[^>]*\\bid="${id}"[^>]*>`, 's'));
  expect(match, `element #${id}`).not.toBeNull();
  return match![0];
};

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
describe('ContactForm accessibility', () => {
  const src = read('src/components/ContactForm.astro');

  it.each(['name', 'email', 'message'])('%s field has aria-required', (id) => {
    expect(openingTag(src, id)).toContain('aria-required="true"');
  });

  it.each(['name', 'email', 'message'])(
    '%s field has aria-describedby pointing to its error element',
    (id) => {
      expect(openingTag(src, id)).toContain(`aria-describedby="${id}-error"`);
    },
  );

  it.each(['name-error', 'email-error', 'message-error'])(
    '#%s has role=alert for screen reader announcement',
    (id) => {
      expect(openingTag(src, id)).toContain('role="alert"');
    },
  );

  it('success state has role=status', () => {
    expect(src).toContain('role="status"');
  });

  it('sets aria-invalid via JavaScript on invalid fields', () => {
    expect(src).toContain("setAttribute('aria-invalid', 'true')");
  });

  it('clears aria-invalid via JavaScript when field is corrected', () => {
    expect(src).toContain("removeAttribute('aria-invalid')");
  });

  it('decorative icons are aria-hidden', () => {
    // Every icon renders through <Icon>, which always sets aria-hidden.
    expect(src).toContain('<Icon name="arrow-right"');
    expect(src).not.toMatch(/<svg\b/);
    expect(read('src/components/Icon.astro')).toMatch(/<svg\b[^>]*aria-hidden="true"/s);
  });

  it('honeypot field is present and skipped by keyboard users', () => {
    const input = openingTag(src, 'website');
    expect(input).toContain('name="website"');
    expect(input).toContain('tabindex="-1"');
  });

  it('honeypot wrapper is hidden from assistive technology', () => {
    expect(src).toMatch(/<div class="honeypot" aria-hidden="true">/);
  });

  it('fires analytics tracking on successful submission', () => {
    expect(src).toContain("track('contact_form_submitted')");
  });

  it('submits through submitContactForm (which posts to /api/contact), not to Web3Forms', () => {
    expect(src).toContain('submitContactForm(');
    expect(src).not.toContain('api.web3forms.com');
  });
});

// ---------------------------------------------------------------------------
// Navbar
// ---------------------------------------------------------------------------
describe('Navbar accessibility', () => {
  const src = read('src/components/Navbar.astro');

  it('mobile menu toggle has aria-label', () => {
    expect(src).toContain('aria-label="Toggle menu"');
  });

  it('logo link has aria-label', () => {
    expect(src).toContain('aria-label="BLOQ Media Home"');
  });
});
