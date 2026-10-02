import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // www is the primary production domain in Vercel (the apex 308-redirects
  // to it), so canonical URLs, og:url, and the sitemap must use it too.
  site: 'https://www.bloq.media',
  output: 'server',
  adapter: vercel(),
  // Self-host Plus Jakarta Sans (downloaded at build time) instead of loading
  // it from Google Fonts. Astro also generates a metric-matched fallback font
  // so the swap doesn't shift the layout.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Plus Jakarta Sans',
      cssVariable: '--font-jakarta',
      weights: [400, 500, 600, 700, 800],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
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
