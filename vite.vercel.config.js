import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Set the root to the current directory
  publicDir: 'client/public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: fs.existsSync('./index.html') 
          ? path.resolve(__dirname, 'index.html') 
          : path.resolve(__dirname, 'client/index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter', '@tanstack/react-query'],
        },
      },
    },
  },
  // Disabling aliases for production build to avoid path resolution issues
  resolve: {
    alias: {}
  }
});