import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Built into ../dist, which wrangler.toml serves as the Worker's ASSETS.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
