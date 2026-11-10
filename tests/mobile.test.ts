/**
 * Mobile contracts: no map download on phones, no viewport-height units,
 * 44 px tap targets, anchor offset, sticky CTA and self-hosted fonts.
 *
 * Only assertions that encode a real contract live here. Exact Tailwind class
 * strings for spacing and type sizes are deliberately not pinned, so a restyle
 * doesn't mean rewriting this file. Scroll and form behavior is unit-tested in
 * tests/lib.
 */
import { existsSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import astroConfig from '../astro.config.mjs';

const root = resolve(__dirname, '..');
const read = (rel: string) => readFileSync(resolve(root, rel), 'utf8');

// ---------------------------------------------------------------------------
// Hero — map bundle must not load on mobile
// ---------------------------------------------------------------------------
describe('Hero mobile optimization', () => {
  const src = read('src/components/Hero.astro');

  it('ships no client-side map code (map is pre-rendered at build time)', () => {
    expect(src).not.toContain('<script');
    expect(src).not.toContain("import('d3')");
    expect(src).not.toContain('world-atlas');
  });

  it('loads the pre-rendered SVG lazily so hidden (mobile) layouts never fetch it', () => {
    expect(src).toContain('src="/hero-map.svg"');
    expect(src).toContain('loading="lazy"');
    expect(src).toContain('hidden lg:block');
  });

  it('reserves the map box size to avoid layout shift', () => {
    expect(src).toContain('aspect-ratio: ${MAP_WIDTH} / ${MAP_HEIGHT}');
    expect(src).toContain('width={MAP_WIDTH}');
    expect(src).toContain('height={MAP_HEIGHT}');
  });
});

// ---------------------------------------------------------------------------
// No viewport-height units (mobile address bars make them jump)
// ---------------------------------------------------------------------------
describe('Viewport-height units', () => {
  const files = [
    ...readdirSync(resolve(root, 'src/components')).map((f) => `src/components/${f}`),
    'src/layouts/Layout.astro',
    'src/styles/global.css',
  ];

  it.each(files)('%s avoids 100vh / h-screen', (rel) => {
    const src = read(rel);
    expect(src).not.toMatch(/\b100vh\b|\b(min-)?h-screen\b/);
  });
});

// ---------------------------------------------------------------------------
// Global styles — anchor offset
// ---------------------------------------------------------------------------
describe('Anchor scroll offset', () => {
  const css = read('src/styles/global.css');

  it('sets scroll-padding-top so anchors clear the fixed navbar', () => {
    expect(css).toMatch(/scroll-padding-top:\s*\d/);
  });
});

// ---------------------------------------------------------------------------
// Responsive section spacing
// ---------------------------------------------------------------------------
describe('Responsive section spacing', () => {
  const sections = [
    'src/components/About.astro',
    'src/components/WhyBloq.astro',
    'src/components/Services.astro',
    'src/components/Articles.astro',
    'src/components/ContactForm.astro',
  ];

  it('the shared Section component ramps padding by breakpoint', () => {
    const sectionTag = read('src/components/Section.astro').match(/<section[^>]*>/)?.[0] ?? '';
    expect(sectionTag).toContain('py-16 sm:py-20');
  });

  it.each(sections)('%s is built on <Section>', (rel) => {
    expect(read(rel)).toMatch(/<Section\b/);
  });
});

// ---------------------------------------------------------------------------
// Fonts — trimmed weights, self-hosted
// ---------------------------------------------------------------------------
describe('Font loading', () => {
  const pkg = JSON.parse(read('package.json'));
  const family = astroConfig.fonts?.[0] as unknown as {
    provider: { name: string };
    options: { variants: { weight: number; src: string[] }[] };
  };
  const variants = family.options.variants;

  it('requests only the weights in use (no 900)', () => {
    expect(variants.map((v) => v.weight)).toEqual([400, 500, 600, 700, 800]);
  });

  it('only ships the latin subset', () => {
    for (const v of variants) {
      expect(v.src).toHaveLength(1);
      expect(v.src[0]).toMatch(/plus-jakarta-sans-latin-\d{3}-normal\.woff2$/);
    }
  });

  it('reads the font files from disk, not from the network at build time', () => {
    expect(family.provider.name).toBe('local');
    for (const v of variants) expect(existsSync(resolve(root, v.src[0]))).toBe(true);
  });

  it('pins the @fontsource package to an exact version', () => {
    const version = pkg.dependencies['@fontsource/plus-jakarta-sans'];
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// ---------------------------------------------------------------------------
// Sticky mobile CTA
// ---------------------------------------------------------------------------
describe('Sticky mobile CTA', () => {
  const src = read('src/components/MobileCta.astro');
  const index = read('src/pages/index.astro');

  it('is rendered on the homepage', () => {
    expect(index).toContain('<MobileCta />');
  });

  it('only shows below md and links to the contact section', () => {
    expect(src).toMatch(/id="mobile-cta"[^>]*class="[^"]*\bmd:hidden\b/s);
    expect(src).toContain('href={sectionHref(CONTACT_SECTION_ID');
  });

  it('starts inert until the hero is scrolled past', () => {
    expect(src).toMatch(/id="mobile-cta"\s+inert/);
    expect(src).toContain('[data-hero]');
  });

  it('respects the iOS home-indicator safe area', () => {
    expect(src).toContain('env(safe-area-inset-bottom)');
  });
});

// ---------------------------------------------------------------------------
// 44 px tap targets (min-h-11 is Tailwind's 2.75rem = 44 px)
// ---------------------------------------------------------------------------
describe('Tap targets', () => {
  it('the small button size still meets 44 px', () => {
    expect(read('src/components/Button.astro')).toMatch(/sm: '[^']*\bmin-h-11\b/);
  });

  it('every footer link is at least 44 px tall on phones', () => {
    const src = read('src/components/Footer.astro');
    const links = src.match(/<a\b[^>]*>/gs) ?? [];
    expect(links.length).toBeGreaterThan(0);
    for (const a of links) expect(a).toMatch(/\bmin-h-11\b/);
  });
});

describe('Mobile keyboard hints', () => {
  it('single-line contact fields advance with a "next" key', () => {
    const src = read('src/components/ContactForm.astro');
    expect(src.match(/enterkeyhint="next"/g)).toHaveLength(3);
  });
});
