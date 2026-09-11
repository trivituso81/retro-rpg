import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the built site works from any sub-path (GitHub Pages, S3 folder, etc.).
// Routing uses a hash router for the same reason.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
  },
});
