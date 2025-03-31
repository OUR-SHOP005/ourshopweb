'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface MarketingConsentFormProps {
  onDashboard?: boolean; // If true, displays as a form on the dashboard
}

export function MarketingConsentForm({ onDashboard = false }: MarketingConsentFormProps) {
  const { user, isLoaded } = useUser()
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  // Fetch current consent status when component loads
  useEffect(() => {
    if (isLoaded && user) {
      fetchConsentStatus()
    }
  }, [isLoaded, user])

  const fetchConsentStatus = async () => {
    try {
      const response = await fetch('/api/marketing-consent')
      if (response.ok) {
        const data = await response.json()
        setMarketingConsent(data.marketingConsent)
      }
    } catch (error) {
      console.error('Error fetching marketing consent status:', error)
    }
  }

  const handleConsentChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !isLoaded) return;
    
    const newConsentValue = event.target.checked
    setMarketingConsent(newConsentValue)
    
    if (!onDashboard) return; // Only save automatically if on dashboard
    
    await saveConsent(newConsentValue)
  }

  const saveConsent = async (consentValue: boolean) => {
    if (!user || !isLoaded) {
      setStatusMessage('Error: User not loaded');
      return;
    }
    
    const emailAddress = user.primaryEmailAddress?.emailAddress;
    
    if (!emailAddress) {
      console.error('No primary email address found');
      setStatusMessage('Error: No email address found');
      return;
    }
    
    console.log('Attempting to save consent with:', {
      email: emailAddress,
      marketingConsent: consentValue,
      userId: user.id
    });
    
    setIsSubmitting(true);
    setStatusMessage(null);
    
    try {
      const response = await fetch('/api/marketing-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          marketingConsent: consentValue,
        }),
      });
      
      console.log('Consent save response status:', response.status);
      
      // Try to get the response body
      let responseBody;
      try {
        responseBody = await response.json();
        console.log('Response body:', responseBody);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
      }
      
      if (response.ok) {
        setStatusMessage(`Marketing preferences ${consentValue ? 'enabled' : 'disabled'} successfully`);
        setTimeout(() => setStatusMessage(null), 3000); // Clear message after 3 seconds
      } else {
        throw new Error(responseBody?.error || `Failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating marketing consent:', error);
      setStatusMessage(`Error: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    await saveConsent(marketingConsent)
  }

  if (!isLoaded || !user) {
    return null
  }

  return (
    <div className={`${onDashboard ? 'p-4 border rounded-lg' : ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="marketing-consent"
              name="marketing-consent"
              type="checkbox"
              checked={marketingConsent}
              onChange={handleConsentChange}
              className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary dark:border-gray-600 dark:focus:ring-secondary"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="marketing-consent" className="font-medium text-gray-700 dark:text-gray-300">
              Marketing Emails
            </label>
            <p className="text-gray-500 dark:text-gray-400">
              I agree to receive marketing emails about updates, new services, and special offers.
            </p>
          </div>
        </div>
        
        {onDashboard && (
          <div className="mt-4 flex items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-secondary text-white px-4 py-2 rounded-md text-sm hover:bg-secondary/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Preferences'}
            </button>
            
            {statusMessage && (
              <span className={`ml-3 text-sm ${statusMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {statusMessage}
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  )
} 