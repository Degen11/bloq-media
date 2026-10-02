import type { APIRoute } from 'astro';
import { MAP_WIDTH, MAP_HEIGHT, countryPaths, cities } from '@lib/heroMap';
import { BRAND } from '@lib/site';

// Rendered once at build time. The hero used to download d3, topojson-client,
// and the 50m world-atlas data (~1 MB of JS) on every desktop visit just to
// draw this decorative outline; now it's a static SVG file. Styled for the
// light hero: navy outlines on a pale fill, navy city dots ringed in blue.
export const prerender = true;

export const GET: APIRoute = () => {
  const countries = countryPaths
    .map(
      (d) =>
        `<path d="${d}" fill="rgba(41,171,226,0.10)" stroke="rgba(26,60,143,0.55)" stroke-width="1" stroke-linejoin="round"/>`,
    )
    .join('');

  const markers = cities
    .map(
      ({ x, y }) =>
        `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="rgba(41,171,226,0.6)" stroke-width="1"/>` +
        `<circle cx="${x}" cy="${y}" r="3.5" fill="${BRAND.navy}"/>`,
    )
    .join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}">` +
    `<g>${countries}</g><g>${markers}</g></svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
