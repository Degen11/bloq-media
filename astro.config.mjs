import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://bloq.media',
  output: 'server',
  adapter: vercel(),
  integrations: [
    sitemap({
      filter: (page) => !page.includes('og-image'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
