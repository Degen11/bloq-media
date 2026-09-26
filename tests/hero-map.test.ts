/**
 * Build-time hero map (src/lib/heroMap.ts + src/pages/hero-map.svg.ts).
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, it, expect } from 'vitest';
import { MAP_WIDTH, MAP_HEIGHT, countryPaths, cities } from '../src/lib/heroMap';

const root = resolve(__dirname, '..');

describe('hero map data', () => {
  it('renders all 11 Southeast Asian countries', () => {
    expect(countryPaths).toHaveLength(11);
    countryPaths.forEach((d) => expect(d.length).toBeGreaterThan(0));
  });

  it('keeps the SVG path data compact (1 decimal place)', () => {
    const total = countryPaths.join('').length;
    expect(total).toBeLessThan(120_000);
    expect(countryPaths.join('')).not.toMatch(/\d\.\d{2}/);
  });

  it('projects every city inside the map box', () => {
    expect(cities).toHaveLength(7);
    for (const c of cities) {
      expect(c.x).toBeGreaterThan(0);
      expect(c.x).toBeLessThan(MAP_WIDTH);
      expect(c.y).toBeGreaterThan(0);
      expect(c.y).toBeLessThan(MAP_HEIGHT);
      expect(c.left).toMatch(/^\d+(\.\d+)?%$/);
      expect(c.top).toMatch(/^\d+(\.\d+)?%$/);
    }
  });
});

describe('hero-map.svg route', () => {
  const src = readFileSync(resolve(root, 'src/pages/hero-map.svg.ts'), 'utf8');

  it('is prerendered to a static file', () => {
    expect(src).toContain('export const prerender = true');
  });

  it('serves SVG', () => {
    expect(src).toContain("'Content-Type': 'image/svg+xml'");
  });
});
