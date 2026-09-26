import type { APIRoute } from 'astro';
import { MAP_WIDTH, MAP_HEIGHT, countryPaths, cities } from '../lib/heroMap';

// Rendered once at build time. The hero used to download d3, topojson-client,
// and the 50m world-atlas data (~1 MB of JS) on every desktop visit just to
// draw this decorative outline; now it's a static SVG file.
export const prerender = true;

export const GET: APIRoute = () => {
  const countries = countryPaths
    .map(
      (d) =>
        `<path d="${d}" fill="rgba(41,171,226,0.08)" stroke="rgba(41,171,226,0.7)" stroke-width="1.2" stroke-linejoin="round" filter="url(#map-glow)"/>`,
    )
    .join('');

  const markers = cities
    .map(
      ({ x, y }) =>
        `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="1"/>` +
        `<circle cx="${x}" cy="${y}" r="2.5" fill="white" filter="url(#map-glow)"/>`,
    )
    .join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_WIDTH} ${MAP_HEIGHT}" width="${MAP_WIDTH}" height="${MAP_HEIGHT}">` +
    `<defs><filter id="map-glow" x="-20%" y="-20%" width="140%" height="140%">` +
    `<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>` +
    `<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>` +
    `</filter></defs>` +
    `<g>${countries}</g><g>${markers}</g></svg>`;

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
};
