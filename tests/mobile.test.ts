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
    expect(src).toContain('hidden lg:block');
  });

  it('reserves the map box size to avoid layout shift', () => {
    expect(src).toContain('aspect-ratio: ${MAP_WIDTH} / ${MAP_HEIGHT}');
    expect(src).toContain('width={MAP_WIDTH}');
    expect(src).toContain('height={MAP_HEIGHT}');
  });

  it('sizes to its content instead of a viewport-height unit (no address-bar jumps)', () => {
    expect(src).not.toContain('min-h-screen');
    expect(src).not.toContain('100vh');
  });

  it('scales the headline down on the smallest screens', () => {
    expect(src).toContain('text-[44px] sm:text-6xl lg:text-[68px]');
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

  it('mobile menu links are block-level with 44px+ tap targets', () => {
    expect(src).toMatch(/sections\.map[\s\S]*?class="block py-3 text-gray-600[^"]*text-base/);
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
  const cfg = read('astro.config.mjs');

  it('requests only the weights in use (no 900)', () => {
    expect(cfg).toContain('weights: [400, 500, 600, 700, 800]');
  });

  it('only downloads the latin subset', () => {
    expect(cfg).toContain("subsets: ['latin']");
  });
});

// ---------------------------------------------------------------------------
// Mobile polish — menu dismissal, hero fold, sticky CTA, client grid
// ---------------------------------------------------------------------------
describe('Mobile menu dismissal', () => {
  const src = read('src/components/Navbar.astro');

  it('closes on a tap outside the menu', () => {
    expect(src).toMatch(
      /addEventListener\('click'[\s\S]*?menu\?\.contains\(target\)[\s\S]*?closeMenu\(\)/,
    );
  });

  it('closes after scrolling away from where it opened', () => {
    expect(src).toMatch(/window\.scrollY - openedAtY/);
  });
});

describe('Hero fits the first screen on small phones', () => {
  const src = read('src/components/Hero.astro');

  it('uses tighter vertical padding below sm', () => {
    expect(src).toContain('py-12 sm:py-16 lg:py-[72px]');
  });

  it('scales the intro paragraph down below sm', () => {
    expect(src).toContain('text-lg sm:text-[19px]');
  });
});

describe('Sticky mobile CTA', () => {
  const src = read('src/components/MobileCta.astro');
  const index = read('src/pages/index.astro');

  it('is rendered on the homepage', () => {
    expect(index).toContain('<MobileCta />');
  });

  it('only shows on small screens and links to the contact section', () => {
    expect(src).toContain('md:hidden fixed bottom-0');
    expect(src).toContain('href="#contact"');
  });

  it('starts hidden and inert until the hero is scrolled past', () => {
    expect(src).toMatch(/id="mobile-cta"\s+inert/);
    expect(src).toContain('translate-y-full');
    expect(src).toContain('[data-hero]');
  });

  it('respects the iOS home-indicator safe area', () => {
    expect(src).toContain('env(safe-area-inset-bottom)');
  });
});

describe('Client logo grid on phones', () => {
  const src = read('src/components/Clients.astro');

  it('uses tighter gap and padding below md so logos get more width', () => {
    expect(src).toContain('gap-3 md:gap-6');
    expect(src).toContain('p-4 md:p-6');
  });
});
