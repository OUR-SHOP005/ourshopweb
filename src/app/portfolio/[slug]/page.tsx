'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Navigation } from '../../../components/Navigation'
import { ShareButtons } from '../../../components/ShareButtons'

// Project data - this would typically come from a database or CMS
const projects = [
  {
    slug: 'e-commerce-platform',
    title: 'E-commerce Platform',
    category: 'Web Design',
    image: '/projects/ecommerce-platform.jpg',
    description: 'A modern e-commerce platform with seamless user experience.',
    details: 'We designed and developed a comprehensive e-commerce solution that includes product catalog management, secure payment processing, user accounts, and an intuitive shopping cart experience.',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Stripe', 'MongoDB'],
    results: 'The platform has seen a 35% increase in conversion rates and a 42% reduction in cart abandonment since launch.'
  },
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    category: 'Branding',
    image: '/projects/brand-identity.jpg',
    description: 'Complete brand identity design for a tech startup.',
    details: 'We created a comprehensive brand identity that included logo design, color palette selection, typography guidelines, and brand voice development to establish a strong market presence.',
    technologies: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    results: 'The new brand identity increased brand recognition by 40% and helped secure an additional round of venture capital funding.'
  },
  {
    slug: 'mobile-app-ui',
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    image: '/projects/mobile-app-ui.jpg',
    description: 'User interface design for a fitness tracking app.',
    details: 'Our team designed an intuitive and engaging user interface for a fitness tracking application that focuses on user motivation, goal setting, and progress visualization.',
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Principle'],
    results: 'User engagement increased by 58% and daily active users doubled within the first three months after redesign.'
  },
  {
    slug: 'corporate-website',
    title: 'Corporate Website',
    category: 'Web Design',
    image: '/projects/corporate-website.jpg',
    description: 'Responsive corporate website with modern design.',
    details: 'We designed and developed a responsive corporate website that effectively communicates the company\'s values, services, and expertise while providing an exceptional user experience on all devices.',
    technologies: ['Next.js', 'Tailwind CSS', 'GSAP', 'Contentful CMS'],
    results: 'The redesigned website resulted in a 45% increase in lead generation and a 30% reduction in bounce rate.'
  },
  {
    slug: 'social-media-app',
    title: 'Social Media App',
    category: 'Mobile Development',
    image: '/projects/social-media-app.jpg',
    description: 'A social networking platform for creative professionals.',
    details: 'We built a specialized social networking application that connects creative professionals, allowing them to showcase their work, collaborate on projects, and discover new opportunities.',
    technologies: ['React Native', 'Firebase', 'Redux', 'Node.js'],
    results: 'The app acquired 50,000 users in the first six months and facilitated over 5,000 successful project collaborations.'
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    category: 'Web Development',
    image: '/projects/analytics-dashboard.jpg',
    description: 'Real-time analytics dashboard for business intelligence.',
    details: 'Our team developed a comprehensive analytics dashboard that provides real-time business intelligence, customizable reporting, and actionable insights for strategic decision-making.',
    technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'AWS'],
    results: 'The dashboard has helped clients identify business optimization opportunities worth an average of $250,000 in annual savings.'
  },
];

export default function PortfolioDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  // Find the project with the matching slug
  const project = projects.find(p => p.slug === slug)

  // If no project is found, show basic info based on the slug
  const title = project ? project.title : slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  
  // Function to get the current page URL for sharing
  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href
    }
    // Fallback if window is not available
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://ourshop.com'}/portfolio/${slug}`
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href="/portfolio" className="text-secondary hover:text-secondary/80 transition-colors mb-8 inline-flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Portfolio
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-secondary">{title}</h1>
            
            {project && (
              <div className="mb-4 text-lg text-secondary font-medium">
                {project.category}
              </div>
            )}
            
            <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={project ? project.image : `/projects/${slug}.jpg`}
                alt={title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Share buttons */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Share this project</h3>
              <ShareButtons 
                url={getShareUrl()} 
                title={`Check out this amazing project: ${title}`}
                size={40}
                className="mb-2"
                showMore={true}
                media={project ? project.image : `/projects/${slug}.jpg`}
              />
            </div>

            <div className="prose dark:prose-invert max-w-none mb-12">
              {project ? (
                <>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    {project.details}
                  </p>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4">Technologies Used</h2>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <h2 className="text-2xl font-bold mt-8 mb-4">Results</h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    {project.results}
                  </p>
                </>
              ) : (
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  This is a detailed view of the {title} project. You can add more content here, such as:
                  <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Project overview and objectives</li>
                    <li>Design process and challenges</li>
                    <li>Technologies and tools used</li>
                    <li>Results and impact</li>
                    <li>Client testimonials</li>
                  </ul>
                </p>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-2">Interested in working with us?</h3>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-6 py-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-colors"
                  >
                    Start a Project
                    <svg
                      className="w-5 h-5 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
                
                {/* Additional share buttons at the bottom */}
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Share this project</h3>
                  <ShareButtons 
                    url={getShareUrl()} 
                    title={`Check out this amazing project: ${title}`}
                    size={32}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 