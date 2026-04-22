/**
 * Accessibility checks via static source analysis.
 * Issues covered: aria-required, aria-describedby, aria-invalid support,
 * role=alert on error regions, modal aria-labelledby, aria-hidden on decorative SVGs.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

// ---------------------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------------------
describe('ContactForm accessibility', () => {
  const src = read('src/components/ContactForm.astro');

  it('name input has aria-required', () => {
    expect(src).toContain('aria-required="true"');
  });

  it('name input has aria-describedby pointing to error element', () => {
    expect(src).toContain('aria-describedby="name-error"');
  });

  it('email input has aria-describedby pointing to error element', () => {
    expect(src).toContain('aria-describedby="email-error"');
  });

  it('message textarea has aria-describedby pointing to error element', () => {
    expect(src).toContain('aria-describedby="message-error"');
  });

  it('error divs have role=alert for screen reader announcement', () => {
    const alertCount = (src.match(/role="alert"/g) ?? []).length;
    // name-error, email-error, message-error, form-error
    expect(alertCount).toBeGreaterThanOrEqual(3);
  });

  it('success state has role=status', () => {
    expect(src).toContain('role="status"');
  });

  it('sets aria-invalid via JavaScript on invalid fields', () => {
    expect(src).toContain("setAttribute('aria-invalid', 'true')");
  });

  it('clears aria-invalid via JavaScript when field is corrected', () => {
    expect(src).toContain("removeAttribute('aria-invalid')");
  });

  it('decorative SVG arrows are aria-hidden', () => {
    expect(src).toContain('aria-hidden="true"');
  });

  it('honeypot field is present', () => {
    expect(src).toContain('name="website"');
    expect(src).toContain('tabindex="-1"');
  });

  it('honeypot is hidden from assistive technology', () => {
    expect(src).toContain('aria-hidden="true"');
    expect(src).toContain('class="honeypot"');
  });

  it('fires analytics tracking on successful submission', () => {
    expect(src).toContain("track('contact_form_submitted')");
  });

  it('submits to /api/contact not directly to Web3Forms', () => {
    expect(src).toContain("fetch('/api/contact'");
    expect(src).not.toContain("fetch('https://api.web3forms.com");
  });
});

// ---------------------------------------------------------------------------
// Modals
// ---------------------------------------------------------------------------
describe('Footer modal accessibility', () => {
  const src = read('src/components/Footer.astro');

  it('privacy dialog has aria-labelledby', () => {
    expect(src).toContain('aria-labelledby="privacy-title"');
  });

  it('terms dialog has aria-labelledby', () => {
    expect(src).toContain('aria-labelledby="terms-title"');
  });

  it('modal heading IDs match aria-labelledby references', () => {
    expect(src).toContain('id="privacy-title"');
    expect(src).toContain('id="terms-title"');
  });

  it('close buttons have aria-label', () => {
    const matches = src.match(/aria-label="Close/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(2);
  });

  it('modal open buttons are present with correct IDs', () => {
    expect(src).toContain('id="open-privacy"');
    expect(src).toContain('id="open-terms"');
  });

  it('close buttons have modal-close class used by JS handler', () => {
    const count = (src.match(/class="modal-close"/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('modals use native <dialog> element', () => {
    const count = (src.match(/<dialog /g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
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
