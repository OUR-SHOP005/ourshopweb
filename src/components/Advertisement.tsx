'use client'

import { useEffect, useState } from 'react'

interface Ad {
  id: string
  title: string
  content: string
  position: 'top' | 'sidebar' | 'bottom' | 'banner'
  status: 'active' | 'inactive'
  startDate: string
  endDate: string
}

interface AdvertisementProps {
  position: 'top' | 'sidebar' | 'bottom' | 'banner'
  className?: string
}

export default function Advertisement({ position, className = '' }: AdvertisementProps) {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true)
        let url = `/api/ads?position=${position}`
        
        // For banner position on home page, use mostPromoted flag to get featured ads
        if (position === 'banner') {
          url = '/api/ads?mostPromoted=true'
        }
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('Failed to fetch advertisements')
        }
        
        const data = await response.json()
        setAds(data)
      } catch (err) {
        console.error('Error fetching ads:', err)
        setError('Failed to load advertisements')
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [position])

  if (loading) {
    return (
      <div className={`advertisement advertisement-${position} ${className}`}>
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg w-full h-32"></div>
      </div>
    )
  }

  if (error || ads.length === 0) {
    return null // Don't show anything if there's an error or no ads
  }

  // For simplicity, just show the first ad for each position
  const ad = ads[0]

  // Different styling based on position
  if (position === 'banner') {
    return (
      <div className={`advertisement advertisement-banner w-full mb-8 ${className}`}>
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-md p-6 text-center">
          <h3 className="text-2xl font-bold text-secondary mb-2">{ad.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{ad.content}</p>
          <button className="bg-secondary hover:bg-secondary/90 text-white font-bold py-2 px-6 rounded-full">
            Learn More
          </button>
        </div>
      </div>
    )
  }

  if (position === 'top') {
    return (
      <div className={`advertisement advertisement-top w-full py-3 px-4 bg-secondary/10 text-center rounded mb-6 ${className}`}>
        <p className="font-medium">
          <span className="font-bold">{ad.title}:</span> {ad.content}
        </p>
      </div>
    )
  }

  if (position === 'sidebar') {
    return (
      <div className={`advertisement advertisement-sidebar mb-6 ${className}`}>
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-lg mb-2">{ad.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{ad.content}</p>
        </div>
      </div>
    )
  }

  // Bottom position
  return (
    <div className={`advertisement advertisement-bottom mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
      <h4 className="font-medium">{ad.title}</h4>
      <p className="text-sm text-gray-600 dark:text-gray-400">{ad.content}</p>
    </div>
  )
} 