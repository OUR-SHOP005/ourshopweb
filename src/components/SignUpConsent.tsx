'use client'

import { useState } from 'react'

export function SignUpConsent() {
  const [marketingConsent, setMarketingConsent] = useState(false)

  // This will be called by the parent component when the sign-up is successful
  // to store the marketing consent preference
  const handleSignUpSuccess = async (userId: string, email: string) => {
    if (!userId || !email) {
      console.error('Cannot save marketing consent: Missing userId or email', { userId, email });
      return;
    }
    
    console.log('Attempting to save sign-up consent:', {
      userId,
      email,
      marketingConsent
    });
    
    try {
      const response = await fetch('/api/marketing-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          marketingConsent,
        }),
      });
      
      console.log('Sign-up consent response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Sign-up consent saved successfully:', data);
    } catch (error) {
      console.error('Error saving marketing consent on sign-up:', error);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="marketing-consent"
            name="marketing-consent"
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="marketing-consent" className="font-medium text-gray-700 dark:text-gray-300">
            Marketing Communications
          </label>
          <p className="text-gray-500 dark:text-gray-400">
            I agree to receive marketing emails about updates, new services, and special offers.
          </p>
        </div>
      </div>
    </div>
  )
} 