import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The dev server proxies API and WebSocket traffic to the backend,
// so the frontend can use relative URLs and no CORS setup is needed.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:4000',
      '/ws': { target: 'ws://localhost:4000', ws: true },
    },
  },
});
