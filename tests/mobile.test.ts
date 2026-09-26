/**
 * Mobile-optimization checks via static source analysis.
 * Covers: build-time hero map, touch-target sizing, anchor scroll offset,
 * responsive section spacing, mobile-safe viewport units, and self-hosted fonts.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';

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
    expect(src).toContain('hidden lg:flex');
  });

  it('reserves the map box size to avoid layout shift', () => {
    expect(src).toContain('aspect-ratio: ${MAP_WIDTH} / ${MAP_HEIGHT}');
    expect(src).toContain('width={MAP_WIDTH}');
    expect(src).toContain('height={MAP_HEIGHT}');
  });

  it('uses a mobile-safe viewport unit for the full-height section', () => {
    expect(src).toContain('min-h-[100svh]');
    expect(src).not.toContain('min-h-screen');
  });

  it('scales the headline down on the smallest screens', () => {
    expect(src).toContain('text-4xl sm:text-5xl');
  });
});

// ---------------------------------------------------------------------------
// Navbar — touch targets
// ---------------------------------------------------------------------------
describe('Navbar touch targets', () => {
  const src = read('src/components/Navbar.astro');

  it('hamburger button has a comfortable tap area', () => {
    expect(src).toContain('id="menu-toggle"');
    expect(src).toMatch(/id="menu-toggle"[\s\S]*?class="[^"]*p-2\.5/);
  });

  it('mobile menu links are block-level with vertical padding', () => {
    const blockLinks = (src.match(/class="block py-2\.5 text-gray-600/g) ?? []).length;
    expect(blockLinks).toBeGreaterThanOrEqual(5);
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

  it.each(sections)('%s uses responsive vertical padding (not a fixed py-28)', (rel) => {
    const src = read(rel);
    // The opening <section> tag should ramp padding by breakpoint.
    const sectionTag = src.match(/<section[^>]*>/)?.[0] ?? '';
    expect(sectionTag).toContain('py-20');
    expect(sectionTag).toContain('lg:py-28');
  });
});

// ---------------------------------------------------------------------------
// Fonts — trimmed weights, self-hosted
// ---------------------------------------------------------------------------
describe('Font loading', () => {
  const cfg = read('astro.config.mjs');

  it('requests only the weights in use (no 800/900)', () => {
    expect(cfg).toContain('weights: [400, 500, 600, 700]');
  });

  it('only downloads the latin subset', () => {
    expect(cfg).toContain("subsets: ['latin']");
  });
});
