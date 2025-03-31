'use client'

import { MotionDiv } from '../../components/ui/MotionWrapper'
import { Navigation } from '../../components/Navigation'
import Advertisement from '../../components/Advertisement'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShareButtons } from '@/components/ShareButtons'

type Project = {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  slug: string;
  status: string;
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample fallback projects when API fails
  const sampleProjects: Project[] = [
    {
      id: '1',
      title: 'E-commerce Platform',
      category: 'Web Design',
      image: '/projects/ecommerce-platform.jpg',
      description: 'A modern e-commerce platform with seamless user experience.',
      slug: 'e-commerce-platform',
      status: 'published'
    },
    {
      id: '2',
      title: 'Brand Identity',
      category: 'Branding',
      image: '/projects/brand-identity.jpg',
      description: 'Complete brand identity design for a tech startup.',
      slug: 'brand-identity',
      status: 'published'
    },
    {
      id: '3',
      title: 'Mobile App UI',
      category: 'UI/UX Design',
      image: '/projects/mobile-app-ui.jpg',
      description: 'User interface design for a fitness tracking app.',
      slug: 'mobile-app-ui',
      status: 'published'
    },
    {
      id: '4',
      title: 'Corporate Website',
      category: 'Web Design',
      image: '/projects/corporate-website.jpg',
      description: 'Responsive corporate website with modern design.',
      slug: 'corporate-website',
      status: 'published'
    },
    {
      id: '5',
      title: 'Social Media App',
      category: 'Mobile Development',
      image: '/projects/social-media-app.jpg',
      description: 'A social networking platform for creative professionals.',
      slug: 'social-media-app',
      status: 'published'
    },
    {
      id: '6',
      title: 'Analytics Dashboard',
      category: 'Web Development',
      image: '/projects/analytics-dashboard.jpg',
      description: 'Real-time analytics dashboard for business intelligence.',
      slug: 'analytics-dashboard',
      status: 'published'
    }
  ];

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const url = selectedCategory 
          ? `/api/projects?category=${encodeURIComponent(selectedCategory)}`
          : '/api/projects';
          
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const data = await response.json();
        
        // Check if we received data from the API
        if (data && data.length > 0) {
          setProjects(data);
          
          // Extract unique categories if we haven't already
          if (categories.length === 0) {
            const uniqueCategories = Array.from(
              new Set(data.map((project: Project) => project.category))
            );
            setCategories(uniqueCategories as string[]);
          }
        } else {
          // If no projects were returned, use sample projects as fallback
          console.log('No projects returned from API, using fallback sample projects');
          setProjects(sampleProjects);
          
          // Extract categories from sample projects
          if (categories.length === 0) {
            const uniqueCategories = Array.from(
              new Set(sampleProjects.map(project => project.category))
            );
            setCategories(uniqueCategories);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects from the database. Showing sample projects instead.');
        
        // Use sample projects when API fails
        setProjects(sampleProjects);
        
        // Extract categories from sample projects
        if (categories.length === 0) {
          const uniqueCategories = Array.from(
            new Set(sampleProjects.map(project => project.category))
          );
          setCategories(uniqueCategories);
        }
        
        setLoading(false);
      }
    }
    
    fetchProjects();
  }, [selectedCategory, categories.length]);
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Filter sample projects when using fallback and a category is selected
  const displayedProjects = selectedCategory 
    ? projects.filter(project => project.category === selectedCategory)
    : projects;

  // Function to get share URL for a specific project
  const getProjectShareUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/portfolio/${slug}`
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ourshop.com'}/portfolio/${slug}`
  }

  // Function to get main portfolio page URL
  const getPortfolioShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ourshop.com'}/portfolio`
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          {/* Top Advertisement */}
          <Advertisement position="top" />
          
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-secondary">Our Portfolio</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
            
            {/* Add share buttons for the whole portfolio page */}
            <div className="flex justify-center mb-4">
              <ShareButtons
                url={getPortfolioShareUrl()}
                title="Check out our amazing portfolio of web design and development projects"
                size={36}
                className="justify-center"
              />
            </div>
          </MotionDiv>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-6 py-2 rounded-full transition-colors ${
                  selectedCategory === category 
                    ? 'bg-secondary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 hover:bg-secondary/10'
                }`}
              >
                {category}
              </button>
            ))}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-gray-100 dark:bg-gray-800 shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="col-span-full text-center p-12">
                <p className="text-red-500">{error}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                  {displayedProjects.map((project, index) => (
                    <MotionDiv
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <div className="relative h-64">
                        <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Link
                            href={`/portfolio/${project.slug}`}
                            className="px-6 py-2 rounded-full bg-white text-secondary hover:bg-secondary hover:text-white transition-colors"
                          >
                            View Project
                          </Link>
                        </div>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-6">
                        <span className="text-sm text-secondary font-medium">{project.category}</span>
                        <h3 className="text-xl font-heading font-bold mt-2 mb-2">{project.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                        <Link
                          href={`/portfolio/${project.slug}`}
                          className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors"
                        >
                          View Details
                          <svg
                            className="w-4 h-4 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </Link>
                      </div>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            ) : projects.length === 0 ? (
              <div className="col-span-full text-center p-12">
                <p className="text-lg text-gray-600 dark:text-gray-400">No projects found.</p>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="mt-4 px-6 py-2 bg-secondary text-white rounded-lg"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              // Actual projects
              displayedProjects.map((project, index) => (
                <MotionDiv
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-64">
                    <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-3">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="px-6 py-2 rounded-full bg-white text-secondary hover:bg-secondary hover:text-white transition-colors"
                      >
                        View Project
                      </Link>
                      
                      {/* Add compact share buttons on hover */}
                      <div className="mt-2 bg-white rounded-full py-1 px-3">
                        <ShareButtons
                          url={getProjectShareUrl(project.slug)}
                          title={`Check out this project: ${project.title}`}
                          size={24}
                        />
                      </div>
                    </div>
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-secondary font-medium">{project.category}</span>
                    <h3 className="text-xl font-heading font-bold mt-2 mb-2">{project.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="text-secondary hover:underline transition-colors flex items-center"
                      >
                        View Details
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                      
                      {/* Add compact share button in card footer */}
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // This is just for showing the share button - the actual sharing happens via the ShareButtons component
                        }}
                        className="text-gray-500 hover:text-secondary transition-colors"
                        aria-label="Share project"
                      >
                        <div className="inline-block">
                          <ShareButtons
                            url={getProjectShareUrl(project.slug)}
                            title={`Check out this project: ${project.title}`}
                            size={18}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </MotionDiv>
              ))
            )}
          </div>
          
          <div className="mt-16">
            {/* Bottom Advertisement */}
            <Advertisement position="bottom" />
          </div>
        </div>
      </main>
    </>
  )
} 