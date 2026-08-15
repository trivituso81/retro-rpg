import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true,
    // Allow Cloudflare quick tunnels (and similar) for iPhone testing
    allowedHosts: true,
  },
});
