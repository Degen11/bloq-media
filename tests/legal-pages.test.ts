/**
 * Privacy Policy and Terms of Service pages.
 *
 * These used to live in <dialog> modals inside the footer, which put ~900
 * words of legal boilerplate into the homepage HTML and left no crawlable
 * trust pages. They're now standalone prerendered routes linked from the
 * footer.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

describe.each([
  ['privacy', 'Privacy Policy'],
  ['terms', 'Terms of Service'],
])('/%s page', (slug, title) => {
  const src = read(`src/pages/${slug}.astro`);

  it('is prerendered', () => {
    expect(src).toContain('export const prerender = true');
  });

  it('has a unique title and description', () => {
    expect(src).toContain(`title="${title} | BLOQ Media"`);
    expect(src).toMatch(/description="[^"]{70,160}"/);
  });

  it('has exactly one h1 with the page title', () => {
    expect(src.match(/<h1/g)?.length).toBe(1);
    expect(src).toContain(`>${title}</h1>`);
  });

  it('uses h2 for sections (no skipped levels)', () => {
    expect(src).toContain('<h2>');
    expect(src).not.toContain('<h3>');
  });

  it('includes last-updated date and governing law', () => {
    expect(src).toContain('Last updated');
    expect(src).toContain('Singapore');
  });

  it('links to the contact email', () => {
    expect(src).toContain('mailto:degen@bloq.media');
  });

  it('renders inside the shared layout with navbar and footer', () => {
    expect(src).toContain('<Layout');
    expect(src).toContain('<Navbar />');
    expect(src).toContain('<Footer />');
  });
});

describe('privacy policy accuracy', () => {
  it('no longer mentions Google Fonts (Inter is self-hosted)', () => {
    expect(read('src/pages/privacy.astro')).not.toContain('Google Fonts');
  });
});

describe('Footer legal links', () => {
  const footer = read('src/components/Footer.astro');

  it('links to /privacy and /terms instead of opening modals', () => {
    expect(footer).toContain('href="/privacy"');
    expect(footer).toContain('href="/terms"');
    expect(footer).not.toContain('<dialog');
    expect(footer).not.toContain('showModal');
  });

  it('bottom bar uses centered flex layout (not justify-between)', () => {
    const bottomBar = footer.slice(footer.lastIndexOf('border-t border-white/10'));
    expect(bottomBar).toContain('items-center gap-3');
    expect(bottomBar).not.toContain('justify-between');
  });

  it('copyright text is present', () => {
    expect(footer).toContain('BLOQ Media. All rights reserved.');
  });
});

describe('Section anchors work from non-home pages', () => {
  it.each(['src/components/Navbar.astro', 'src/components/Footer.astro'])(
    '%s prefixes section anchors with "/" off the homepage',
    (file) => {
      const src = read(file);
      expect(src).toContain("const home = Astro.url.pathname === '/' ? '' : '/';");
      expect(src).not.toMatch(/href="#(about|why|services|articles|clients|contact)"/);
    },
  );
});

describe('legal page styles', () => {
  const css = read('src/styles/global.css');

  it('defines .legal-content typography', () => {
    expect(css).toContain('.legal-content h2');
  });
});
