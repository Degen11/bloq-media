/**
 * Config file validation — vercel.json, robots.txt, package.json.
 * These cover infrastructure issues discovered during this session.
 */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');

function readJSON(rel: string) {
  return JSON.parse(readFileSync(resolve(root, rel), 'utf8'));
}

function readText(rel: string) {
  return readFileSync(resolve(root, rel), 'utf8');
}

// ---------------------------------------------------------------------------
// package.json
// ---------------------------------------------------------------------------
describe('package.json', () => {
  const pkg = readJSON('package.json');

  it('has astro check script', () => {
    expect(pkg.scripts.check).toBe('astro check');
  });

  it('has test script', () => {
    expect(pkg.scripts.test).toBeDefined();
  });

  it('does not depend on resend (removed as unused)', () => {
    expect(pkg.dependencies?.resend).toBeUndefined();
  });

  it('does not depend on @astrojs/node (removed as unused)', () => {
    expect(pkg.dependencies?.['@astrojs/node']).toBeUndefined();
  });

  it('uses astro v6+', () => {
    const ver = pkg.dependencies?.astro ?? '';
    expect(parseInt(ver.replace(/[^0-9]/, ''), 10)).toBeGreaterThanOrEqual(6);
  });

  it('uses @astrojs/vercel v10+', () => {
    const ver = pkg.dependencies?.['@astrojs/vercel'] ?? '';
    expect(parseInt(ver.replace(/[^0-9]/, ''), 10)).toBeGreaterThanOrEqual(10);
  });

  it('uses tailwindcss v4+', () => {
    const ver = pkg.devDependencies?.tailwindcss ?? '';
    expect(parseInt(ver.replace(/[^0-9]/, ''), 10)).toBeGreaterThanOrEqual(4);
  });

  // @astrojs/check requires TypeScript ^5.0.0 — TS 6 breaks it
  it('pins typescript to v5.x (v6 incompatible with @astrojs/check)', () => {
    const ver = pkg.devDependencies?.typescript ?? '';
    expect(ver).toMatch(/^\^?5\./);
  });
});

// ---------------------------------------------------------------------------
// vercel.json
// ---------------------------------------------------------------------------
describe('vercel.json', () => {
  it('exists', () => {
    expect(existsSync(resolve(root, 'vercel.json'))).toBe(true);
  });

  const cfg = readJSON('vercel.json');
  const headerEntries: { key: string; value: string }[] =
    cfg.headers?.[0]?.headers ?? [];
  const headerMap = Object.fromEntries(headerEntries.map((h) => [h.key, h.value]));

  it('sets X-Frame-Options to DENY', () => {
    expect(headerMap['X-Frame-Options']).toBe('DENY');
  });

  it('sets X-Content-Type-Options to nosniff', () => {
    expect(headerMap['X-Content-Type-Options']).toBe('nosniff');
  });

  it('sets Referrer-Policy', () => {
    expect(headerMap['Referrer-Policy']).toBeDefined();
  });

  it('sets Content-Security-Policy', () => {
    expect(headerMap['Content-Security-Policy']).toBeDefined();
  });

  it('CSP includes frame-ancestors none', () => {
    expect(headerMap['Content-Security-Policy']).toContain("frame-ancestors 'none'");
  });

  it('CSP includes form-action self', () => {
    expect(headerMap['Content-Security-Policy']).toContain("form-action 'self'");
  });

  it("CSP script-src includes 'unsafe-inline' (required: Astro 6 inlines small scripts)", () => {
    // Astro 6 inlines scripts below the size threshold as <script> tags.
    // Without unsafe-inline these are silently blocked by the browser.
    expect(headerMap['Content-Security-Policy']).toContain("'unsafe-inline'");
  });

  it('CSP allows Google Fonts stylesheet', () => {
    expect(headerMap['Content-Security-Policy']).toContain('fonts.googleapis.com');
  });

  it('CSP allows Google Fonts files', () => {
    expect(headerMap['Content-Security-Policy']).toContain('fonts.gstatic.com');
  });

  it('headers apply to all routes', () => {
    expect(cfg.headers?.[0]?.source).toMatch(/\//);
  });
});

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
describe('robots.txt', () => {
  it('exists in public/', () => {
    expect(existsSync(resolve(root, 'public/robots.txt'))).toBe(true);
  });

  const txt = readText('public/robots.txt');

  it('allows all crawlers', () => {
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
  });

  it('references sitemap', () => {
    expect(txt).toContain('Sitemap:');
    expect(txt).toContain('sitemap');
  });
});
