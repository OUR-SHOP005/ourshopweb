import { useState } from 'react';

export default function BuildSettings() {
  const [buildCommand, setBuildCommand] = useState("vite build");
  const [outputDir, setOutputDir] = useState("dist");
  const [nodeVersion, setNodeVersion] = useState("18.x");
  const [installDevDeps, setInstallDevDeps] = useState(true);

  const handleSave = () => {
    // In a real app, this would save the settings to the backend
    console.log("Saving build settings:", {
      buildCommand,
      outputDir,
      nodeVersion,
      installDevDeps
    });
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <h3 className="text-lg leading-6 font-medium text-neutral-900">Build Configuration</h3>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">Settings for the build process</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="buildCommand" className="block text-sm font-medium text-neutral-700">Build Command</label>
            <div className="mt-1">
              <input 
                type="text" 
                name="buildCommand" 
                id="buildCommand" 
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                value={buildCommand}
                onChange={(e) => setBuildCommand(e.target.value)}
              />
            </div>
            <p className="mt-2 text-sm text-neutral-500">The command Vercel will run to build your project</p>
          </div>
          
          <div>
            <label htmlFor="outputDir" className="block text-sm font-medium text-neutral-700">Output Directory</label>
            <div className="mt-1">
              <input 
                type="text" 
                name="outputDir" 
                id="outputDir" 
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md"
                value={outputDir}
                onChange={(e) => setOutputDir(e.target.value)}
              />
            </div>
            <p className="mt-2 text-sm text-neutral-500">Directory that contains the build output to be deployed</p>
          </div>
          
          <div>
            <label htmlFor="nodeVersion" className="block text-sm font-medium text-neutral-700">Node.js Version</label>
            <div className="mt-1 relative">
              <select 
                id="nodeVersion" 
                name="nodeVersion" 
                className="block w-full pl-3 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                value={nodeVersion}
                onChange={(e) => setNodeVersion(e.target.value)}
              >
                <option value="18.x">18.x</option>
                <option value="16.x">16.x</option>
                <option value="14.x">14.x</option>
              </select>
            </div>
            <p className="mt-2 text-sm text-neutral-500">Node.js version used during build</p>
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input 
                id="installDevDependencies" 
                name="installDevDependencies" 
                type="checkbox" 
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-neutral-300 rounded"
                checked={installDevDeps}
                onChange={(e) => setInstallDevDeps(e.target.checked)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="installDevDependencies" className="font-medium text-neutral-700">Install Dev Dependencies</label>
              <p className="text-neutral-500">Install devDependencies during build</p>
            </div>
          </div>
          
          <div>
            <button 
              type="button" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={handleSave}
            >
              Save Build Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
