'use client'

import { Navigation } from '@/components/Navigation'
import { ShareButtons } from '@/components/ShareButtons'

export default function ShareExamplesPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Share Buttons Examples</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Example */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Share Buttons</h2>
              <ShareButtons 
                url="https://ourshop.com" 
                title="Check out OurShop - Web Design & Development Agency" 
              />
            </div>
            
            {/* Larger Icons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Larger Icons (48px)</h2>
              <ShareButtons 
                url="https://ourshop.com" 
                title="Check out OurShop - Web Design & Development Agency" 
                size={48}
              />
            </div>
            
            {/* Square Icons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Square Icons</h2>
              <ShareButtons 
                url="https://ourshop.com" 
                title="Check out OurShop - Web Design & Development Agency" 
                round={false}
              />
            </div>
            
            {/* Custom Styling */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Custom Styling</h2>
              <ShareButtons 
                url="https://ourshop.com" 
                title="Check out OurShop - Web Design & Development Agency" 
                className="justify-center space-x-4"
                size={40}
              />
            </div>
          </div>
          
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Usage Guide</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                The <code>ShareButtons</code> component provides an easy way to add social media sharing 
                to your application. Here are the props you can use:
              </p>
              
              <ul>
                <li><code>url</code>: The URL to be shared (required)</li>
                <li><code>title</code>: The title/text to be shared (required)</li>
                <li><code>size</code>: Icon size in pixels (default: 32)</li>
                <li><code>round</code>: Whether to use round icons (default: true)</li>
                <li><code>className</code>: Additional CSS classes to apply to the container</li>
              </ul>
              
              <h3>Example Code</h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto">
{`import { ShareButtons } from '@/components/ShareButtons'

<ShareButtons 
  url="https://example.com" 
  title="Check out this page!" 
  size={32}
  round={true}
  className="my-4"
/>`}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 