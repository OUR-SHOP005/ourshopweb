'use client';

import { Navigation } from '../components/Navigation';
import { MotionDiv } from '../components/ui/MotionWrapper';
import Advertisement from '../components/Advertisement';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <Navigation />
      <main className="pt-16">
        <section className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-secondary">
                We Create Digital Experiences That Matter
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Award-winning web design agency helping businesses succeed in the digital world through innovative design and development solutions.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="px-8 py-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/portfolio"
                  className="px-8 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  View Our Work
                </Link>
              </div>
            </MotionDiv>
          </div>
        </section>

        {/* Featured Banner Ad - Most Promoted */}
        <div className="container mx-auto px-4 my-8">
          <Advertisement position="banner" />
        </div>

        <section className="py-20">
          <div className="container mx-auto px-4">
            {/* Top Advertisement */}
            <Advertisement position="top" />
            
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Choose OurShop?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Experience the best of local shopping with our unique offerings
              </p>
            </MotionDiv>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Local Experience',
                  description: 'We understand the local market and provide services tailored to our community.',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  title: 'Quality Service',
                  description: 'Our team is dedicated to providing exceptional service and support.',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ),
                },
                {
                  title: 'Customer First',
                  description: "Your satisfaction is our top priority. We're here to help you succeed.",
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                },
              ].map((feature, index) => (
                <MotionDiv
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-8 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-secondary mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </MotionDiv>
              ))}
            </div>
            
            {/* Bottom Advertisement */}
            <Advertisement position="bottom" />
          </div>
        </section>

        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Contact us today to learn more about our services and how we can help you.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-colors"
              >
                Get in Touch
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
            </MotionDiv>
          </div>
        </section>
      </main>
    </div>
  );
} 