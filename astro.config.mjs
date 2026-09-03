import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://romariojveloso-fiteclabs.github.io',
  base: '/cmdb-frontend-poc',
  integrations: [react()],
});
