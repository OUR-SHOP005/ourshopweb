# Deploying to Vercel

This guide provides step-by-step instructions for deploying this application to Vercel.

## Prerequisites

1. A Vercel account
2. The Vercel CLI installed (optional, but helpful for troubleshooting)
3. Git repository connected to Vercel

## Deployment Instructions

### Option 1: Direct from GitHub

1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Configure the project with these settings:
   - Framework Preset: `Other`
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add any necessary environment variables
5. Click "Deploy"

### Option 2: Using Vercel CLI

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log into Vercel:
   ```
   vercel login
   ```

3. Deploy from the root of the project:
   ```
   vercel
   ```

4. Follow the prompts and use these settings:
   - Build Command: `chmod +x build.sh && ./build.sh`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

## Important Files for Deployment

The following files handle the deployment process:

- `vercel.json`: Configuration for Vercel deployment
- `build.sh`: Custom build script that properly handles the build process
- `vite.vercel.config.js`: Specialized Vite configuration for Vercel

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Vercel build logs for specific errors
2. Ensure all dependencies are properly listed in package.json
3. Verify that the paths in import statements don't use @ aliases directly
4. Make sure the `api` directory is correctly set up for serverless functions

For path resolution issues (common with Vite/React apps using path aliases like `@/components`), the build script automatically fixes these for the production build.