import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bloq.media',
  integrations: [
    tailwind(),
    sitemap({
      filter: (page) => !page.includes('og-image'),
    }),
  ],
});
