import { useState } from "react";
import Sidebar from "../components/layout/sidebar";
import ConfigFileCard from "../components/deployment/config-file-card";
import EnvironmentVariables from "../components/deployment/environment-variables";
import BuildSettings from "../components/deployment/build-settings";
import Troubleshooting from "../components/deployment/troubleshooting";

// Renamed to avoid conflict with Home.tsx
export default function DeploymentDashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-100 text-neutral-800">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <div className="flex-1 md:pl-64">
        <main className="py-6 px-4 sm:px-6 md:px-8">
          {/* Overview Section */}
          <section id="overview" className={`mb-8 ${activeSection !== "overview" && "hidden"}`}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-neutral-900">Vercel Deployment Dashboard</h1>
              <button 
                type="button" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <i className="ri-restart-line mr-2"></i>
                Redeploy
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-50 rounded-md p-3">
                      <i className="ri-check-line text-xl text-green-500"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral-500 truncate">Deployment Status</dt>
                        <dd>
                          <div className="text-lg font-medium text-green-600">Ready</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                      <i className="ri-timer-line text-xl text-blue-500"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral-500 truncate">Last Deployed</dt>
                        <dd>
                          <div className="text-lg font-medium text-neutral-800">2 hours ago</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-neutral-50 rounded-md p-3">
                      <i className="ri-git-branch-line text-xl text-neutral-700"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-neutral-500 truncate">Branch</dt>
                        <dd>
                          <div className="text-lg font-medium text-neutral-800">main</div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Configuration Section */}
          <section id="configuration" className={`mb-8 ${activeSection !== "configuration" && "hidden"}`}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Vercel Configuration</h2>
            
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
                <h3 className="text-lg leading-6 font-medium text-neutral-900">Project Settings</h3>
                <p className="mt-1 max-w-2xl text-sm text-neutral-500">Configuration needed for React/Vite deployment on Vercel</p>
              </div>
              
              <ConfigFileCard 
                filename="vercel.json"
                description="Route configuration for SPA"
                required={true}
                code={`{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}`}
              />
              
              <ConfigFileCard 
                filename="vite.config.js"
                description="Path resolution configuration"
                required={false}
                warning={true}
                code={`import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
})`}
              />
              
              <ConfigFileCard 
                filename="tsconfig.json"
                description="TypeScript path aliases"
                required={false}
                warning={true}
                code={`{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`}
                isLast={true}
              />
            </div>
          </section>
          
          {/* Environment Variables Section */}
          <section id="environment" className={`mb-8 ${activeSection !== "environment" && "hidden"}`}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Environment Variables</h2>
            <EnvironmentVariables />
          </section>
          
          {/* Build Settings Section */}
          <section id="build" className={`mb-8 ${activeSection !== "build" && "hidden"}`}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Build Settings</h2>
            <BuildSettings />
          </section>
          
          {/* Troubleshooting Section */}
          <section id="troubleshooting" className={`mb-8 ${activeSection !== "troubleshooting" && "hidden"}`}>
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Troubleshooting</h2>
            <Troubleshooting />
          </section>
        </main>
      </div>
    </div>
  );
}
