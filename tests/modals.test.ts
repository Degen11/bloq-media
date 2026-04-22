/**
 * Privacy Policy and Terms of Service modal tests.
 *
 * Root cause discovered: Astro 6 inlines small component scripts as
 * <script> tags. Our original script-src 'self' CSP blocked them,
 * silently preventing the modals (and mobile menu) from working.
 * Fix: added 'unsafe-inline' to script-src in vercel.json.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

describe('Privacy & Terms modal structure', () => {
  const footer = read('src/components/Footer.astro');

  // Dialog elements
  it('privacy-modal dialog exists', () => {
    expect(footer).toContain('id="privacy-modal"');
  });

  it('terms-modal dialog exists', () => {
    expect(footer).toContain('id="terms-modal"');
  });

  it('both modals use native <dialog> element', () => {
    const dialogs = footer.match(/<dialog /g) ?? [];
    expect(dialogs.length).toBe(2);
  });

  // Trigger buttons
  it('Privacy Policy trigger button exists', () => {
    expect(footer).toContain('id="open-privacy"');
  });

  it('Terms of Service trigger button exists', () => {
    expect(footer).toContain('id="open-terms"');
  });

  // Button positioning — centered layout
  it('bottom bar uses centered flex layout (not justify-between)', () => {
    // The bottom strip should be centered. Extract just that section.
    const bottomBar = footer.slice(footer.lastIndexOf('border-t border-white/10'));
    expect(bottomBar).toContain('items-center gap-3');
    expect(bottomBar).not.toContain('justify-between');
  });

  // Script wiring
  it('script calls showModal() on privacy button click', () => {
    expect(footer).toContain("openModal('privacy-modal')");
  });

  it('script calls showModal() on terms button click', () => {
    expect(footer).toContain("openModal('terms-modal')");
  });

  it('script binds close button handler', () => {
    expect(footer).toContain('bindClose');
  });

  it('script handles backdrop click to close', () => {
    expect(footer).toContain('e.target === dialog');
  });

  // Modal content
  it('privacy modal has content heading', () => {
    expect(footer).toContain('Privacy Policy');
  });

  it('terms modal has content heading', () => {
    expect(footer).toContain('Terms of Service');
  });

  it('modals include last-updated date', () => {
    const dateMatches = footer.match(/Last updated/g) ?? [];
    expect(dateMatches.length).toBeGreaterThanOrEqual(2);
  });

  it('modals include governing law (Singapore)', () => {
    expect(footer).toContain('Singapore');
  });

  it('modals link to contact email', () => {
    const emailLinks = footer.match(/degen@bloq\.media/g) ?? [];
    expect(emailLinks.length).toBeGreaterThanOrEqual(1);
  });
});

describe('CSP allows modal scripts to execute', () => {
  const vercel = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf8'));
  const headers: { key: string; value: string }[] =
    vercel.headers?.[0]?.headers ?? [];
  const csp = headers.find((h) => h.key === 'Content-Security-Policy')?.value ?? '';

  it("CSP script-src includes 'unsafe-inline' (Astro 6 inlines small scripts)", () => {
    expect(csp).toContain("'unsafe-inline'");
  });
});

describe('Footer layout', () => {
  const footer = read('src/components/Footer.astro');

  it('privacy and terms buttons are siblings in the same container', () => {
    const privacyPos = footer.indexOf('id="open-privacy"');
    const termsPos = footer.indexOf('id="open-terms"');
    // Both should be within 300 chars of each other (same container)
    expect(Math.abs(privacyPos - termsPos)).toBeLessThan(300);
  });

  it('copyright text is present', () => {
    expect(footer).toContain('BLOQ Media. All rights reserved.');
  });
});
