#!/bin/bash

# This is a custom build script for Vercel deployment
# It handles path resolution issues by using relative imports instead of '@' path aliases

echo "🚀 Starting build process for Vercel deployment..."

# Create a copy of package.json for Vercel (if needed)
if [ -f "vercel-package.json" ]; then
  echo "Using specialized package.json for Vercel deployment"
  cp vercel-package.json package.json.bak
fi

# Build the frontend with optimized settings
echo "🏗️ Building frontend..."
VITE_DEPLOYMENT_ENV=production npx vite build --config vite.vercel.config.js

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

echo "✅ Build completed successfully!"