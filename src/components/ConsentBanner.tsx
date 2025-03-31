'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export function ConsentBanner() {
  const { user, isLoaded } = useUser()
  const [showBanner, setShowBanner] = useState(false)
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasCheckedStorage, setHasCheckedStorage] = useState(false)

  // Check local storage for consent preference and whether banner was dismissed
  useEffect(() => {
    const bannerDismissed = localStorage.getItem('consentBannerDismissed')
    
    if (bannerDismissed === 'true') {
      setShowBanner(false)
    } else {
      setShowBanner(true)
    }
    
    setHasCheckedStorage(true)
  }, [])

  // Fetch current consent from API when user is loaded
  useEffect(() => {
    if (isLoaded && user && hasCheckedStorage) {
      fetchConsentStatus()
    }
  }, [isLoaded, user, hasCheckedStorage])

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

  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMarketingConsent(event.target.checked)
  }

  const saveConsent = async () => {
    if (!user || !isLoaded) {
      // If user is not logged in, just save to local storage and dismiss banner
      localStorage.setItem('consentBannerDismissed', 'true')
      setShowBanner(false)
      return
    }
    
    const emailAddress = user.primaryEmailAddress?.emailAddress;
    
    if (!emailAddress) {
      console.error('No primary email address found for user');
      // Still dismiss the banner but log the error
      localStorage.setItem('consentBannerDismissed', 'true');
      setShowBanner(false);
      return;
    }
    
    console.log('Attempting to save consent from banner:', {
      email: emailAddress,
      marketingConsent,
      userId: user.id
    });
    
    setIsSaving(true)
    
    try {
      const response = await fetch('/api/marketing-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          marketingConsent,
        }),
      })
      
      console.log('Consent save response status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
        console.log('Response data:', responseData);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
      }
      
      if (response.ok) {
        // Save user's choice and dismiss banner
        localStorage.setItem('consentBannerDismissed', 'true')
        setShowBanner(false)
      } else {
        throw new Error(responseData?.error || `Failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error updating marketing consent:', error)
      // Still dismiss the banner to prevent blocking the user
      localStorage.setItem('consentBannerDismissed', 'true')
      setShowBanner(false)
    } finally {
      setIsSaving(false)
    }
  }

  const dismissBanner = () => {
    localStorage.setItem('consentBannerDismissed', 'true')
    setShowBanner(false)
  }

  // Don't show anything if checking storage or banner is dismissed
  if (!hasCheckedStorage || !showBanner) {
    return null
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-gradient-to-r from-primary to-secondary text-white p-4 sm:p-6 shadow-lg animate-fade-in-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1">We Value Your Privacy</h3>
          <p className="text-sm text-white/90 mb-2">
            We'd like to send you occasional updates about our services and special offers. 
            Would you like to receive marketing emails from us?
          </p>
          <div className="flex items-center">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={marketingConsent}
              onChange={handleConsentChange}
              className="h-4 w-4 rounded border-white/30 bg-white/20 text-white focus:ring-secondary"
            />
            <label htmlFor="consent-checkbox" className="ml-2 text-sm font-medium">
              Yes, I'd like to receive marketing emails
            </label>
          </div>
        </div>
        <div className="flex items-center space-x-3 mt-3 sm:mt-0">
          <button
            onClick={dismissBanner}
            className="px-4 py-2 text-sm bg-transparent border border-white/30 hover:bg-white/10 rounded-md transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={saveConsent}
            disabled={isSaving}
            className="px-4 py-2 text-sm bg-white text-primary hover:bg-white/90 rounded-md font-medium transition-colors disabled:opacity-75"
          >
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  )
} 