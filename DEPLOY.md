# Deploying to Vercel

This guide provides step-by-step instructions for deploying this application to Vercel.

## Prerequisites

1. A Vercel account
2. The Vercel CLI installed (optional, but helpful for troubleshooting)
3. Git repository connected to Vercel

## Deployment Instructions

### Updated Approach (Recommended)

1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Configure the project with these settings:
   - Framework Preset: None (or select "Other") 
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
   - Install Command: `cd client && npm install`

4. Add any necessary environment variables
5. Click "Deploy"

### Alternative Options

You can also deploy using:

1. Vercel CLI:
   ```
   vercel
   ```

2. Dashboard:
   - Choose "No framework preset" when deploying
   - Make sure your Root Directory is set to the repository root
   - Let Vercel use the settings from vercel.json

## Important Files for Deployment

The following files handle the deployment process:

- `vercel.json`: Simple configuration that tells Vercel to build the client directory
- `client/package.json`: Contains build script for the frontend
- `client/vite.config.js`: Vite configuration specific to the client

## Troubleshooting

If you encounter issues with the deployment:

1. Check the Vercel build logs for specific errors
2. Make sure package.json exists in the client directory
3. Verify that the output directory is correctly set to `client/dist`
4. Try deploying with a simpler configuration first, then add more complex settings

The key to fixing the "No Output Directory" and "Could not resolve entry module" errors is ensuring that:
1. We properly build the client application separately from the server
2. We point Vercel directly to the client/dist folder
3. We avoid complex build scripts that might confuse Vercel

This simplified approach should work better with Vercel's deployment system.