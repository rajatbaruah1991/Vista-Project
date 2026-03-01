// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://venew.qzz.io',
  outDir: './output',
  vite: {
    plugins: [tailwindcss()],
  },
  server: {
    host: true
  }
});