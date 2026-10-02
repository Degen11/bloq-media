/**
 * SEO and structured data tests.
 * Issues covered: missing NewsMediaOrganization schema, font preload, canonical
 * host mismatch (apex vs www), unlinked JSON-LD entities, over-long description.
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

  it('does not claim a publishingPrinciples page that does not exist', () => {
    expect(src).not.toContain('publishingPrinciples');
  });

  it('WebSite publisher references the Organization by @id', () => {
    expect(src).toContain("'@id': orgId");
    expect(src).toContain("publisher: { '@id': orgId }");
  });

  it('schema email matches the address shown on the page', () => {
    const site = read('src/lib/site.ts');
    const form = read('src/components/ContactForm.astro');
    expect(site).toContain("CONTACT_EMAIL = 'hello@bloq.media'");
    expect(src).toContain('email: CONTACT_EMAIL');
    expect(src).not.toContain('TEAM_EMAIL');
    expect(form).toContain('{CONTACT_EMAIL}');
  });

  it('sameAs is built from the shared social profiles', () => {
    expect(src).toContain('sameAs: socials.map((s) => s.href)');
  });

  it('has a ContactPoint', () => {
    expect(src).toContain("'@type': 'ContactPoint'");
  });

  it('builds absolute URLs from Astro.site instead of hardcoding a host', () => {
    expect(src).not.toContain("'https://bloq.media'");
    expect(src).toContain('new URL(Astro.url.pathname, Astro.site)');
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

  it('skips canonical and emits noindex when the noindex prop is set', () => {
    expect(src).toContain('{!noindex && <link rel="canonical"');
    expect(src).toMatch(/noindex\s*\?\s*'noindex, follow'/);
  });

  it('default meta description fits in a search snippet (<= 160 chars)', () => {
    // The first `description =` is the prop default; either quote style is fine
    const match = src.match(/description =\s*(['"])((?:\\.|(?!\1)[^\\])*)\1/);
    expect(match).not.toBeNull();
    const text = match![2].replace(/\\(['"])/g, '$1');
    expect(text.length).toBeGreaterThan(70);
    expect(text.length).toBeLessThanOrEqual(160);
  });

  it('drops meta tags search engines ignore', () => {
    expect(src).not.toContain('name="keywords"');
    expect(src).not.toContain('name="title"');
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
  const cfg = read('astro.config.mjs');

  it('self-hosts Inter via the Astro Fonts API', () => {
    expect(cfg).toContain('fontProviders.fontsource()');
    expect(cfg).toContain("cssVariable: '--font-inter'");
    expect(src).toContain('<Font cssVariable="--font-inter"');
  });

  it('preloads the body and headline weights', () => {
    expect(src).toContain('preload={[{ weight: 400 }, { weight: 700 }]}');
  });

  it('no longer loads fonts from Google Fonts', () => {
    expect(src).not.toContain('fonts.googleapis.com');
    expect(src).not.toContain('fonts.gstatic.com');
  });
});

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
describe('robots.txt SEO', () => {
  const txt = readFileSync(resolve(root, 'public/robots.txt'), 'utf8');

  it('references the sitemap on the canonical www host', () => {
    expect(txt).toContain('Sitemap: https://www.bloq.media/sitemap-index.xml');
  });

  it('does not block all crawlers', () => {
    expect(txt).not.toContain('Disallow: /\n');
  });
});

// ---------------------------------------------------------------------------
// Site config
// ---------------------------------------------------------------------------
describe('astro.config.mjs SEO', () => {
  const cfg = read('astro.config.mjs');

  it('site matches the primary Vercel domain (www)', () => {
    expect(cfg).toContain("site: 'https://www.bloq.media'");
  });

  it('sitemap excludes image endpoints and the 404 page', () => {
    expect(cfg).toContain('!/\\.(png|svg)$/.test(page)');
    expect(cfg).toContain("!page.endsWith('/404/')");
  });
});

// ---------------------------------------------------------------------------
// 404 page
// ---------------------------------------------------------------------------
describe('404 page', () => {
  const src = read('src/pages/404.astro');

  it('is prerendered so Vercel serves it statically', () => {
    expect(src).toContain('export const prerender = true');
  });

  it('uses the site layout with noindex', () => {
    expect(src).toContain('<Layout');
    expect(src).toContain('noindex');
  });

  it('links back to the homepage', () => {
    expect(src).toContain('href="/"');
  });
});
