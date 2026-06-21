/**
 * Mobile-optimization checks via static source analysis.
 * Covers: deferred/gated map bundle, touch-target sizing, anchor scroll offset,
 * responsive section spacing, mobile-safe viewport units, and trimmed/non-blocking fonts.
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

  it('does not statically import the heavy map dependencies', () => {
    // Top-level static imports would bundle d3/topojson/world-atlas for every
    // device. They must be loaded via dynamic import() inside the gate instead.
    expect(src).not.toMatch(/^\s*import\s+\*\s+as\s+d3\s+from\s+'d3'/m);
    expect(src).not.toMatch(/^\s*import\s+worldData\s+from\s+'world-atlas/m);
  });

  it('loads the map dependencies via dynamic import', () => {
    expect(src).toContain("await import('d3')");
    expect(src).toContain("await import('topojson-client')");
    expect(src).toContain("await import('world-atlas/countries-50m.json')");
  });

  it('gates map initialization behind a desktop media query', () => {
    expect(src).toContain('matchMedia');
    expect(src).toContain('(min-width: 1024px)');
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
// Fonts — trimmed weights, non-blocking load
// ---------------------------------------------------------------------------
describe('Font loading', () => {
  const src = read('src/layouts/Layout.astro');

  it('does not request unused 800/900 weights', () => {
    expect(src).not.toContain('500;600;700;800;900');
  });

  it('requests only the weights in use', () => {
    expect(src).toContain('Inter:wght@400;500;600;700&display=swap');
  });

  it('loads the stylesheet non-render-blocking with a noscript fallback', () => {
    expect(src).toContain('media="print"');
    expect(src).toContain("setAttribute('media','all')");
    expect(src).toContain('<noscript>');
  });
});
