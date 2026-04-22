/**
 * Performance optimisation tests.
 * Issues covered: client logos missing loading=lazy, OG image fetching fonts
 * on every request (no caching).
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

// ---------------------------------------------------------------------------
// Image lazy loading
// ---------------------------------------------------------------------------
describe('Clients component image loading', () => {
  const src = read('src/components/Clients.astro');

  it('client logo images have loading="lazy"', () => {
    expect(src).toContain('loading="lazy"');
  });

  it('client logo images have decoding="async"', () => {
    expect(src).toContain('decoding="async"');
  });
});

// ---------------------------------------------------------------------------
// OG image font caching
// ---------------------------------------------------------------------------
describe('OG image font caching (og-image.png.ts)', () => {
  const src = read('src/pages/og-image.png.ts');

  it('declares a module-level font cache variable', () => {
    // fontCache persists across requests on a warm serverless instance
    expect(src).toContain('fontCache');
  });

  it('guards font fetch behind cache check', () => {
    expect(src).toContain('if (!fontCache)');
  });

  it('assigns fetched fonts to the cache', () => {
    expect(src).toContain('fontCache = {');
  });

  it('returns early from cache on subsequent calls', () => {
    expect(src).toContain('return fontCache');
  });

  it('uses Uint8Array for Response body (TypeScript 6 BodyInit compat)', () => {
    expect(src).toContain('new Uint8Array(png)');
  });
});

// ---------------------------------------------------------------------------
// CSS / fonts
// ---------------------------------------------------------------------------
describe('Tailwind v4 setup', () => {
  const cfg = read('astro.config.mjs');

  it('uses @tailwindcss/vite plugin instead of @astrojs/tailwind integration', () => {
    expect(cfg).toContain('@tailwindcss/vite');
    expect(cfg).not.toContain('@astrojs/tailwind');
  });

  it('does not reference removed tailwind.config.mjs', () => {
    // The old v3 config file should not be referenced anywhere
    expect(cfg).not.toContain('tailwind.config');
  });
});

describe('global CSS theme', () => {
  const css = read('src/styles/global.css');

  it('uses @import "tailwindcss" (Tailwind v4 entry point)', () => {
    expect(css).toContain('@import "tailwindcss"');
  });

  it('defines custom bloq-blue color', () => {
    expect(css).toContain('--color-bloq-blue');
  });

  it('defines custom bloq-navy color', () => {
    expect(css).toContain('--color-bloq-navy');
  });

  it('defines custom bloq-dark color', () => {
    expect(css).toContain('--color-bloq-dark');
  });

  it('defines custom font-sans for Inter', () => {
    expect(css).toContain('--font-sans');
    expect(css).toContain('Inter');
  });

  it('defines honeypot utility class', () => {
    expect(css).toContain('.honeypot');
  });

  it('defines modal-dialog styles', () => {
    expect(css).toContain('.modal-dialog');
  });

  it('defines dialog::backdrop', () => {
    expect(css).toContain('::backdrop');
  });
});
