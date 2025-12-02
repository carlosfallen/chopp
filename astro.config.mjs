// FILE: astro.config.mjs (atualizado)
import { defineConfig } from 'astro/config';
import solidJs from '@astrojs/solid-js';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    mode: 'directory',
    platformProxy: {
      enabled: true
    }
  }),
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp-not-installed"
    }
  },
  integrations: [solidJs()],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    }
  }
});