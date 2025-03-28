'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import Link from 'next/link'
import { MotionDiv } from '@/components/ui/MotionWrapper'

const projects = [
  {
    title: 'E-commerce Platform',
    category: 'Web Design',
    image: 'https://placehold.co/600x400/0984E3/FFFFFF/png?text=E-commerce+Platform',
    description: 'A modern e-commerce platform with seamless user experience.',
  },
  {
    title: 'Brand Identity',
    category: 'Branding',
    image: 'https://placehold.co/600x400/00B894/FFFFFF/png?text=Brand+Identity',
    description: 'Complete brand identity design for a tech startup.',
  },
  {
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    image: 'https://placehold.co/600x400/0984E3/FFFFFF/png?text=Mobile+App+UI',
    description: 'User interface design for a fitness tracking app.',
  },
  {
    title: 'Corporate Website',
    category: 'Web Design',
    image: 'https://placehold.co/600x400/00B894/FFFFFF/png?text=Corporate+Website',
    description: 'Responsive corporate website with modern design.',
  },
]

export function PortfolioSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section">
      <div className="container">
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Portfolio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our latest projects and see how we've helped businesses transform their digital presence.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <MotionDiv
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64">
                <div className="absolute inset-0 bg-black/40 z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  href={`/portfolio/${project.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center text-secondary hover:text-secondary/80 transition-colors"
                >
                  View Project
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

        <div className="text-center mt-12">
          <Link href="/portfolio" className="btn btn-outline">
            View All Projects
          </Link>
        </div>
      </div>
    </section>
  )
} 