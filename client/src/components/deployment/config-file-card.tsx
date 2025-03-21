import { useState } from 'react';

interface ConfigFileCardProps {
  filename: string;
  description: string;
  required: boolean;
  warning?: boolean;
  code: string;
  isLast?: boolean;
}

export default function ConfigFileCard({ 
  filename, 
  description, 
  required, 
  warning = false,
  code,
  isLast = false 
}: ConfigFileCardProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className={`${!isLast ? "border-b border-neutral-200" : ""}`}>
      <div className="px-4 py-5 sm:px-6">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-md font-medium text-neutral-900">{filename}</h4>
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
          </div>
          {required ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
              Required
            </span>
          ) : warning ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-500">
              Update Needed
            </span>
          ) : null}
        </div>
        
        <div className="mt-4 bg-neutral-50 rounded-md overflow-hidden">
          <pre className="p-4 text-sm text-neutral-800 font-mono overflow-x-auto">
            {code}
          </pre>
        </div>
        
        <div className="mt-2 flex">
          <button 
            type="button" 
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
            onClick={copyToClipboard}
          >
            <i className={`${copied ? 'ri-check-line' : 'ri-file-copy-line'} mr-1`}></i> 
            {copied ? 'Copied!' : 'Copy code'}
          </button>
          <button 
            type="button" 
            className="ml-4 inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
            onClick={downloadFile}
          >
            <i className="ri-download-line mr-1"></i> Download
          </button>
        </div>
      </div>
    </div>
  );
}
