// This script handles Vercel deployment for the project
// It specifically addresses path resolution issues with "@" imports

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 Starting Vercel deployment build process...');

// Function to recursively fix imports in .ts and .tsx files
function fixImportsInDirectory(directory) {
  const files = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const file of files) {
    const fullPath = path.join(directory, file.name);
    
    if (file.isDirectory()) {
      fixImportsInDirectory(fullPath);
      continue;
    }
    
    // Only process TypeScript files
    if (!file.name.endsWith('.ts') && !file.name.endsWith('.tsx')) {
      continue;
    }
    
    console.log(`Checking imports in ${fullPath}`);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix @/ imports using relative paths
    const containsAtImports = content.includes('@/');
    if (containsAtImports) {
      console.log(`Fixing @/ imports in ${fullPath}`);
      
      // Create a temp backup
      fs.writeFileSync(`${fullPath}.bak`, content);
      
      // Replace @/ imports with relative imports using path calculation
      const relDir = path.relative(directory, path.join(rootDir, 'client', 'src'));
      const relPath = relDir ? `./${relDir}/` : './';
      
      content = content.replace(/@\/components\//g, `${relPath}components/`);
      content = content.replace(/@\/lib\//g, `${relPath}lib/`);
      content = content.replace(/@\/hooks\//g, `${relPath}hooks/`);
      content = content.replace(/@\/context\//g, `${relPath}context/`);
      content = content.replace(/@\/pages\//g, `${relPath}pages/`);
      content = content.replace(/@\//g, `${relPath}`);
      
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Fixed imports in ${fullPath}`);
    }
  }
}

// Fix imports before building
console.log('🔍 Checking and fixing imports...');
try {
  fixImportsInDirectory(path.join(rootDir, 'client', 'src'));
  console.log('✅ Import paths fixed successfully!');
} catch (error) {
  console.error('❌ Error fixing imports:', error.message);
  // Continue with the build anyway
}

// Create a special Vite config for production builds
console.log('📝 Creating production Vite config...');
const viteConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'wouter', '@tanstack/react-query'],
        },
      },
    },
  },
  resolve: {
    alias: {
      // No alias needed for production build
    },
  },
});
`;

fs.writeFileSync(path.join(rootDir, 'vite.config.prod.js'), viteConfigContent);

// Build the frontend with production settings
console.log('🏗️ Building frontend...');
try {
  execSync('VITE_DEPLOYMENT_ENV=production npx vite build --config vite.config.prod.js', {
    stdio: 'inherit',
    cwd: rootDir
  });
  console.log('✅ Frontend build completed successfully!');
} catch (error) {
  console.error('❌ Frontend build failed:', error.message);
  process.exit(1);
}

// Build the backend for serverless functions
console.log('🏗️ Building backend for serverless functions...');
try {
  // Create api directory if it doesn't exist
  const apiDir = path.join(rootDir, 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir);
  }
  
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api', {
    stdio: 'inherit',
    cwd: rootDir
  });
  
  // Generate Vercel serverless function handler
  const serverlessHandler = `
// api/index.js - Vercel serverless function entry point
import { createServer } from 'http';
import { apiHandler } from '../dist/_server.js';

export default async function handler(req, res) {
  // Create a Node.js Server instance
  const server = createServer();
  
  // Pass the request to our API handler
  return apiHandler(req, res, server);
}
`;

  fs.writeFileSync(path.join(apiDir, 'index.js'), serverlessHandler);
  console.log('✅ Backend build completed successfully!');
} catch (error) {
  console.error('❌ Backend build failed:', error.message);
  process.exit(1);
}

// Clean up
try {
  // Remove temporary files
  fs.unlinkSync(path.join(rootDir, 'vite.config.prod.js'));
} catch (error) {
  console.warn('⚠️ Warning while cleaning up:', error.message);
}

console.log('✨ All build steps completed successfully!');
console.log('📦 The application is ready for Vercel deployment.');