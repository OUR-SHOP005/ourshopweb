import { useState } from 'react';

interface EnvironmentVariable {
  id: string;
  name: string;
  value: string;
  isSecret: boolean;
}

export default function EnvironmentVariables() {
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([
    { id: '1', name: 'VITE_API_URL', value: 'https://api.example.com', isSecret: false },
    { id: '2', name: 'VITE_AUTH_DOMAIN', value: 'auth.example.com', isSecret: false },
    { id: '3', name: 'RESEND_API_KEY', value: '••••••••••••••••', isSecret: true },
    { id: '4', name: 'GEMINI_API_KEY', value: '••••••••••••••••', isSecret: true },
  ]);

  const handleEdit = (id: string) => {
    // In a real app, this would open an edit modal
    console.log("Edit variable with ID:", id);
  };

  const handleDelete = (id: string) => {
    // In a real app, this would confirm before deleting
    setEnvironmentVariables(environmentVariables.filter(variable => variable.id !== id));
  };

  const handleAddVariable = () => {
    // In a real app, this would open a creation modal
    console.log("Add new variable");
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <h3 className="text-lg leading-6 font-medium text-neutral-900">Vercel Environment Variables</h3>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">These variables will be available during build and runtime</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        <div className="overflow-hidden border border-neutral-200 rounded-md">
          <ul className="divide-y divide-neutral-200">
            {environmentVariables.map((variable) => (
              <li key={variable.id} className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{variable.name}</p>
                  <p className="text-sm text-neutral-500 truncate">{variable.value}</p>
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button 
                    type="button" 
                    className="inline-flex items-center p-1.5 border border-neutral-300 rounded-md shadow-sm text-neutral-500 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => handleEdit(variable.id)}
                  >
                    <i className="ri-pencil-line text-lg"></i>
                  </button>
                  <button 
                    type="button" 
                    className="ml-2 inline-flex items-center p-1.5 border border-neutral-300 rounded-md shadow-sm text-neutral-500 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => handleDelete(variable.id)}
                  >
                    <i className="ri-delete-bin-line text-lg"></i>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
          <button 
            type="button" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleAddVariable}
          >
            <i className="ri-add-line mr-2"></i>
            Add Environment Variable
          </button>
        </div>
      </div>
    </div>
  );
}
