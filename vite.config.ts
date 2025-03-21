import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: 'client/src',          // Set the new root to `client/src`
  build: {
    outDir: '../../dist',      // Output the build outside `client/src`
    rollupOptions: {
      input: 'client/src/index.html'   // Specify the new entry module
    }
  },
  server: {
    port: 3000
  }
});
