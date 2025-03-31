'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Navigation } from '@/components/Navigation'
import { ShareButtons } from '@/components/ShareButtons'
import Link from 'next/link'

interface Project {
  _id: string
  title: string
  description: string
  image: string
  category: string
  liveUrl?: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const res = await fetch(`/api/projects?id=${params.id}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch project')
        }
        
        const data = await res.json()
        setProject(data)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError('Failed to load project details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  // Function to get the current page URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    // Fallback if window is not available
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ourshop.com'}/projects/${params.id}`
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
              <Link 
                href="/projects" 
                className="mt-6 inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90"
              >
                Back to Projects
              </Link>
            </div>
          ) : project ? (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <Link 
                  href="/projects" 
                  className="text-secondary hover:underline flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Projects
                </Link>
              </div>

              <h1 className="text-4xl font-bold mb-6">{project.title}</h1>
              
              <div className="rounded-lg overflow-hidden mb-8 relative aspect-video">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  {project.category}
                </span>
                {project.status === 'published' ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm">
                    Published
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 rounded-full text-sm">
                    Draft
                  </span>
                )}
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                <p>{project.description}</p>
              </div>
              
              {project.liveUrl && (
                <div className="mb-8">
                  <a 
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="inline-flex items-center px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                  >
                    <span>View Live Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
              
              <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Share this project</h3>
                <ShareButtons 
                  url={getShareUrl()} 
                  title={`Check out this project: ${project.title}`} 
                  size={40}
                  className="mb-2"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Last updated: {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400">The project you're looking for doesn't exist or has been removed.</p>
              <Link 
                href="/projects" 
                className="mt-6 inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90"
              >
                View All Projects
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 