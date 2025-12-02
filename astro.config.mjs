// FILE: astro.config.mjs
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    platformProxy: {
      enabled: true,
      configPath: 'wrangler.toml'
    }
  }),
  integrations: [solidJs()],
  vite: {
    ssr: {
      external: ['node:async_hooks']
    }
  }
});