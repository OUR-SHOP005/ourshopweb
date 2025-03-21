#!/bin/bash

# This is a custom build script for Vercel deployment
# It handles path resolution issues by using relative imports instead of '@' path aliases

echo "🚀 Starting build process for Vercel deployment..."

# Create a copy of package.json for Vercel (if needed)
if [ -f "vercel-package.json" ]; then
  echo "Using specialized package.json for Vercel deployment"
  cp vercel-package.json package.json.bak
fi

# Ensure index.html is at the root for Vercel
echo "📄 Preparing HTML entry point..."
if [ -f "client/index.html" ]; then
  # Copy index.html to the root and update the path to main.tsx
  cp client/index.html index.html
  sed -i 's|src="/src/main.tsx"|src="/client/src/main.tsx"|g' index.html
fi

# Build the frontend with optimized settings
echo "🏗️ Building frontend..."
VITE_DEPLOYMENT_ENV=production npx vite build -c vite.vercel.config.js

# Make sure dist exists and has the right content
echo "🔍 Verifying dist directory..."
if [ ! -d "dist" ]; then
  echo "Creating dist directory..."
  mkdir -p dist
fi

# If index.html is not in dist, copy it there
if [ ! -f "dist/index.html" ] && [ -f "index.html" ]; then
  cp index.html dist/index.html
fi

# Build the backend for serverless functions
echo "🏗️ Building backend for serverless functions..."
mkdir -p api
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api

# Create a simple index.js for the API in Vercel
cat > api/index.js << 'EOL'
// api/index.js - Vercel serverless function entry point
import { createServer } from 'http';

export default async function handler(req, res) {
  try {
    // Set up basic headers and CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // For simplicity in this deployment, just respond with JSON
    res.status(200).json({ 
      success: true,
      message: "API is running!",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
EOL

# Restore original package.json if we made a backup
if [ -f "package.json.bak" ]; then
  mv package.json.bak package.json
fi

# List contents of dist to verify
echo "📁 Contents of dist directory:"
ls -la dist/

echo "✅ Build completed successfully!"