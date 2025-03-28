'use client'

import { MotionDiv } from '../../components/ui/MotionWrapper'
import { Navigation } from '../../components/Navigation'
import Image from 'next/image'
import Link from 'next/link'

const projects = [
  {
    title: 'E-commerce Platform',
    category: 'Web Design',
    image: '/projects/ecommerce-platform.jpg',
    description: 'A modern e-commerce platform with seamless user experience.',
    slug: 'e-commerce-platform'
  },
  {
    title: 'Brand Identity',
    category: 'Branding',
    image: '/projects/brand-identity.jpg',
    description: 'Complete brand identity design for a tech startup.',
    slug: 'brand-identity'
  },
  {
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    image: '/projects/mobile-app-ui.jpg',
    description: 'User interface design for a fitness tracking app.',
    slug: 'mobile-app-ui'
  },
  {
    title: 'Corporate Website',
    category: 'Web Design',
    image: '/projects/corporate-website.jpg',
    description: 'Responsive corporate website with modern design.',
    slug: 'corporate-website'
  },
  {
    title: 'Social Media App',
    category: 'Mobile Development',
    image: '/projects/social-media-app.jpg',
    description: 'A social networking platform for creative professionals.',
    slug: 'social-media-app'
  },
  {
    title: 'Analytics Dashboard',
    category: 'Web Development',
    image: '/projects/analytics-dashboard.jpg',
    description: 'Real-time analytics dashboard for business intelligence.',
    slug: 'analytics-dashboard'
  },
]

const categories = Array.from(new Set(projects.map(project => project.category)))

export default function PortfolioPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-secondary">Our Portfolio</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore our latest projects and see how we've helped businesses transform their digital presence.
            </p>
          </MotionDiv>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-secondary hover:text-white transition-colors"
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <MotionDiv
                key={project.title}
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
      </main>
    </>
  )
} 