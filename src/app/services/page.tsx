'use client'

import { ServicesSection } from '@/components/sections/ServicesSection'
import { MotionDiv } from '@/components/ui/MotionWrapper'
import { Navigation } from '@/components/Navigation'
import Advertisement from '@/components/Advertisement'
import Link from 'next/link'

const additionalServices = [
  {
    title: 'Custom Web Development',
    description: 'Tailored web solutions built with cutting-edge technologies to meet your specific business needs.',
    features: ['Full-stack development', 'E-commerce solutions', 'API integration', 'Performance optimization'],
    startingPrice: 7999,
  },
  {
    title: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications that deliver exceptional user experiences.',
    features: ['iOS & Android apps', 'React Native development', 'App maintenance', 'App store optimization'],
    startingPrice: 6999,
  },
  {
    title: 'Digital Strategy',
    description: 'Strategic digital solutions to help your business grow and succeed in the digital landscape.',
    features: ['Market analysis', 'Competitive research', 'Growth strategy', 'Digital transformation'],
    startingPrice: 3999,
  },
]

export default function ServicesPage() {
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Our Services</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              We offer comprehensive digital solutions to help your business thrive in the modern digital landscape.
            </p>
          </MotionDiv>
          
          {/* Top Advertisement */}
          <Advertisement position="top" />
        </div>

        <ServicesSection />

        <section className="section bg-gray-50 dark:bg-gray-900 py-16">
          <div className="container mx-auto px-4">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-heading font-bold text-center mb-12">Additional Services</h2>
              
              {/* Sidebar Advertisement */}
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-3/4 space-y-12">
                  {additionalServices.map((service, index) => (
                    <MotionDiv
                      key={service.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-heading font-bold">{service.title}</h3>
                        <div className="text-secondary font-bold">
                          <span className="text-sm">Starting from</span>
                          <div className="text-2xl">₹{service.startingPrice}</div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-center text-gray-600 dark:text-gray-300">
                            <svg
                              className="w-5 h-5 text-secondary mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </MotionDiv>
                  ))}
                </div>
                <div className="lg:w-1/4">
                  <div className="sticky top-24">
                    <Advertisement position="sidebar" />
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </section>

        <section className="section py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-heading font-bold mb-6">Ready to Start Your Project?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Let's discuss how we can help transform your digital presence.
              </p>
              <Link href="/contact" className="btn btn-primary px-8 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors">
                Get in Touch
              </Link>
              
              {/* Bottom Advertisement */}
              <div className="mt-16">
                <Advertisement position="bottom" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
} 