import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const isDevelopmentServer = process.argv.includes('dev');

export default defineConfig({
  site: 'https://romariojveloso-fiteclabs.github.io',
  base: isDevelopmentServer ? '/' : '/cmdb-frontend-poc',
  integrations: [react()],
});
