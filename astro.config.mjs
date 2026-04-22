import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

export default defineConfig({
  site: 'https://bloq.media',
  output: 'hybrid',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('og-image'),
    }),
  ],
});
