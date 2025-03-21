import { useState } from 'react';
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "../../components/ui/accordion";

interface TroubleshootingItem {
  id: string;
  title: string;
  description: string;
  errorExample: string;
  solution: string;
}

export default function Troubleshooting() {
  const troubleshootingItems: TroubleshootingItem[] = [
    {
      id: "path-resolution",
      title: "Path resolution issues with \"@\" imports",
      description: "The \"@\" path alias needs to be properly configured in both vite.config.js and tsconfig.json. Make sure both configurations match and point to the correct directory.",
      errorExample: "Error: Cannot find module '@/components/Button'",
      solution: "Update your vite.config.js and tsconfig.json as shown in the Configuration section."
    },
    {
      id: "raw-code",
      title: "Raw React code is displayed instead of rendering",
      description: "This usually happens when the React application isn't properly compiled or when the server doesn't correctly handle SPA routing.",
      errorExample: "The page shows code like <div id=\"root\"></div> instead of the actual application.",
      solution: "Make sure you have a proper vercel.json file with the correct rewrites configuration as shown in the Configuration section."
    },
    {
      id: "env-vars",
      title: "Environment variables not accessible in frontend",
      description: "In Vite, only environment variables prefixed with VITE_ are exposed to your frontend code.",
      errorExample: "console.log(import.meta.env.API_KEY) // undefined",
      solution: "Rename your environment variables in Vercel to include the VITE_ prefix, e.g., VITE_API_KEY."
    },
    {
      id: "module-not-found",
      title: "Build fails with \"Module not found\" errors",
      description: "This typically occurs when dependencies are missing or there are issues with package installation.",
      errorExample: "Error: Cannot find module 'some-package'",
      solution: "Check your package.json to ensure all dependencies are correctly listed. Make sure to include them in the correct section (dependencies vs. devDependencies) based on whether they're needed at runtime."
    }
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
        <h3 className="text-lg leading-6 font-medium text-neutral-900">Common Issues & Solutions</h3>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">Resolving deployment problems</p>
      </div>
      
      <div className="px-4 py-5 sm:px-6">
        <Accordion type="single" collapsible className="space-y-4">
          {troubleshootingItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.title}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-neutral-700">{item.description}</p>
                <div className="mt-3 bg-neutral-50 rounded-md p-3">
                  <p className="text-xs text-neutral-600 font-mono">{item.errorExample}</p>
                </div>
                <p className="mt-3 text-sm text-neutral-700">
                  <span className="font-semibold">Solution:</span> {item.solution}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
