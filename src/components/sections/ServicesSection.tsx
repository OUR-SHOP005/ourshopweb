'use client'

import { useInView } from 'react-intersection-observer'
import { MotionDiv } from '@/components/ui/MotionWrapper'

const services = [
  {
    title: 'Web Design',
    description: 'Create stunning, responsive websites that captivate your audience.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    startingPrice: 4999,
  },
  {
    title: 'UI/UX Design',
    description: 'Design intuitive user interfaces and seamless user experiences.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    startingPrice: 5999,
  },
  {
    title: 'Branding',
    description: 'Build a strong brand identity that sets you apart from competitors.',
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    startingPrice: 3499,
  },
]

export function ServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="section bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <MotionDiv
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Our Services</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We offer a comprehensive range of digital services to help your business thrive in the modern digital landscape.
          </p>
        </MotionDiv>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <MotionDiv
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-secondary mb-6">{service.icon}</div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-heading font-bold">{service.title}</h3>
                <div className="text-secondary font-bold">
                  <span className="text-sm">Starting from</span>
                  <div className="text-2xl">₹{service.startingPrice}</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
} 