/**
 * SEO and structured data tests.
 * Issues covered: missing NewsMediaOrganization schema, missing font preload.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------
describe('structured data (Layout.astro)', () => {
  const src = read('src/layouts/Layout.astro');

  it('Organization schema includes NewsMediaOrganization type', () => {
    expect(src).toContain('NewsMediaOrganization');
  });

  it('schema type is an array with both Organization and NewsMediaOrganization', () => {
    expect(src).toContain("'@type': ['Organization', 'NewsMediaOrganization']");
  });

  it('has publishingPrinciples field (NewsMediaOrganization requirement)', () => {
    expect(src).toContain('publishingPrinciples');
  });

  it('has WebSite schema', () => {
    expect(src).toContain("'@type': 'WebSite'");
  });

  it('JSON-LD scripts use is:inline directive', () => {
    const count = (src.match(/is:inline/g) ?? []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('has canonical URL', () => {
    expect(src).toContain('rel="canonical"');
  });

  it('has Open Graph tags', () => {
    expect(src).toContain('og:title');
    expect(src).toContain('og:description');
    expect(src).toContain('og:image');
  });

  it('has Twitter card tags', () => {
    expect(src).toContain('twitter:card');
    expect(src).toContain('twitter:title');
  });
});

// ---------------------------------------------------------------------------
// Font loading
// ---------------------------------------------------------------------------
describe('font loading (Layout.astro)', () => {
  const src = read('src/layouts/Layout.astro');

  it('has preconnect to fonts.googleapis.com', () => {
    expect(src).toContain('rel="preconnect"');
    expect(src).toContain('fonts.googleapis.com');
  });

  it('has preconnect to fonts.gstatic.com with crossorigin', () => {
    expect(src).toContain('fonts.gstatic.com');
    expect(src).toContain('crossorigin');
  });

  it('has preload link for Google Fonts stylesheet', () => {
    expect(src).toContain('rel="preload"');
    expect(src).toContain('as="style"');
  });

  it('Google Fonts URL includes display=swap for font-display:swap', () => {
    expect(src).toContain('display=swap');
  });
});

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
describe('robots.txt SEO', () => {
  const txt = readFileSync(resolve(root, 'public/robots.txt'), 'utf8');

  it('references the sitemap URL', () => {
    expect(txt).toContain('sitemap');
  });

  it('does not block all crawlers', () => {
    expect(txt).not.toContain('Disallow: /\n');
  });
});
