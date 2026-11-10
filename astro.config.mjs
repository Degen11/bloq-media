import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Latin-subset woff2 files from the exactly pinned @fontsource package, with
// the same unicode-range Fontsource uses for its latin subset.
const LATIN_RANGE = [
  'U+0000-00FF',
  'U+0131',
  'U+0152-0153',
  'U+02BB-02BC',
  'U+02C6',
  'U+02DA',
  'U+02DC',
  'U+0304',
  'U+0308',
  'U+0329',
  'U+2000-206F',
  'U+20AC',
  'U+2122',
  'U+2191',
  'U+2193',
  'U+2212',
  'U+2215',
  'U+FEFF',
  'U+FFFD',
];
const jakarta = (weight) => ({
  weight,
  style: 'normal',
  unicodeRange: LATIN_RANGE,
  src: [
    `./node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-${weight}-normal.woff2`,
  ],
});

export default defineConfig({
  // www is the primary production domain in Vercel (the apex 308-redirects
  // to it), so canonical URLs, og:url, and the sitemap must use it too.
  site: 'https://www.bloq.media',
  output: 'server',
  adapter: vercel(),
  // Self-host Plus Jakarta Sans from the @fontsource package instead of
  // loading it from Google Fonts or fetching it from the Fontsource API at
  // build time. The package version is pinned exactly in package.json and
  // locked with an integrity hash, so every build ships the same font files
  // and builds don't need network access for fonts. Astro also generates a
  // metric-matched fallback font so the swap doesn't shift the layout.
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [400, 500, 600, 700, 800].map(jakarta),
      },
    },
  ],
  integrations: [
    sitemap({
      // Only HTML pages: skip prerendered image endpoints and the 404 page.
      filter: (page) => !/\.(png|svg)$/.test(page) && !page.endsWith('/404/'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
