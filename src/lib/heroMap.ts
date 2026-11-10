// Shared by the build-time map route (src/pages/hero-map.svg.ts) and
// Hero.astro, which positions the city hover labels over the rendered image.
// Everything here runs at build time only; none of it ships to the browser.

import { geoMercator, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import type { GeometryCollection, Topology } from 'topojson-specification';
// @ts-ignore — world-atlas ships plain JSON, no type declarations needed
import worldData from 'world-atlas/countries-50m.json';

export const MAP_WIDTH = 600;
export const MAP_HEIGHT = 520;

// ISO 3166-1 numeric codes for Southeast Asian countries
const SEA_IDS = new Set([96, 104, 116, 360, 418, 458, 608, 626, 702, 704, 764]);

// The JSON import infers loose tuple types, so go through unknown to the TopoJSON shape.
const world = worldData as unknown as Topology<{ countries: GeometryCollection }>;
const allCountries = feature(world, world.objects.countries);
const seaCollection: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: allCountries.features.filter((f) => SEA_IDS.has(Number(f.id))),
};

const projection = geoMercator().fitExtent(
  [
    [24, 24],
    [MAP_WIDTH - 24, MAP_HEIGHT - 24],
  ],
  seaCollection,
);

// One decimal place is plenty at this size and keeps the SVG small.
const path = geoPath().projection(projection).digits(1);

export const countryPaths: string[] = seaCollection.features.map((f) => path(f) ?? '');

const CITIES: { name: string; coords: [number, number] }[] = [
  { name: 'Singapore', coords: [103.82, 1.35] },
  { name: 'Bangkok', coords: [100.52, 13.75] },
  { name: 'Manila', coords: [120.98, 14.6] },
  { name: 'Ho Chi Minh', coords: [106.66, 10.78] },
  { name: 'Kuala Lumpur', coords: [101.69, 3.14] },
  { name: 'Yangon', coords: [96.17, 16.87] },
];

export const cities = CITIES.map(({ name, coords }) => {
  const [x, y] = projection(coords) ?? [0, 0];
  return {
    name,
    x: Math.round(x * 10) / 10,
    y: Math.round(y * 10) / 10,
    // Percent offsets so HTML hover targets line up with the scaled image
    left: `${((x / MAP_WIDTH) * 100).toFixed(2)}%`,
    top: `${((y / MAP_HEIGHT) * 100).toFixed(2)}%`,
  };
});
