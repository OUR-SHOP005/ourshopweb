# Deploying to Vercel

This guide provides step-by-step instructions for deploying this application to Vercel.

## Prerequisites

1. A Vercel account
2. The Vercel CLI installed (optional, but helpful for troubleshooting)
3. Git repository connected to Vercel

## Deployment Instructions

### Vite Framework Approach (Recommended)

1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Configure the project with these settings:
   - Framework Preset: `Vite` 
   - Root Directory: `client` (important!)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. Add any necessary environment variables
5. Click "Deploy"

### Using vercel.json (Alternative)

If Vercel auto-detects your project as a Vite project, you can let it use the configuration from vercel.json:

1. Create a new project in Vercel
2. Connect to your GitHub repository
3. Make sure the Root Directory is set to the repository root, not the client directory
4. Vercel will use the settings from vercel.json:
   - buildCommand: `cd client && npm run build`
   - outputDirectory: `client/dist`
   - installCommand: `cd client && npm install`
   - framework: `vite`

## Important Files for Deployment

The following files handle the deployment process:

- `vercel.json`: Configuration that tells Vercel to build the client directory as a Vite project
- `client/package.json`: Contains build script for the frontend
- `client/vite.config.js`: Vite configuration specific to the client
- `client/index.html`: Standard Vite entry point

## Troubleshooting

If you encounter issues with the deployment:

1. **For "No Output Directory" errors**:
   - Make sure you've set the Root Directory to `client` if using the Vite framework preset
   - Or keep the Root Directory as the repo root and use vercel.json's outputDirectory setting

2. **For "Could not resolve entry module" errors**:
   - Ensure client/index.html exists and has the correct path to main.tsx
   - Make sure the Vite build process can find all entry points

3. **Other common issues**:
   - Try using the Vercel CLI with `vercel --debug` for more detailed logs
   - Temporarily simplify the build by using just the frontend portion

The key to successful deployment is making sure Vercel understands your project structure correctly, especially with a monorepo setup that has both frontend and backend code.

## Final Notes

When Vercel detects a Vite project, it will try to apply its own optimization settings. Our configuration aligns with these expectations while also ensuring the correct paths are used.