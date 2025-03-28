'use client'

import { useInView } from 'react-intersection-observer'
import Image from 'next/image'
import { useState } from 'react'
import { MotionDiv } from '@/components/ui/MotionWrapper'

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart',
    image: 'https://placehold.co/200x200/0984E3/FFFFFF/png?text=SJ',
    content: 'Working with DesignAgency was an absolute pleasure. They transformed our brand identity and website, helping us stand out in a crowded market.',
  },
  {
    name: 'Michael Chen',
    role: 'Founder, GrowthLabs',
    image: 'https://placehold.co/200x200/00B894/FFFFFF/png?text=MC',
    content: 'The team at DesignAgency delivered beyond our expectations. Their attention to detail and creative approach made our project a huge success.',
  },
  {
    name: 'Emma Davis',
    role: 'Marketing Director, InnovateCorp',
    image: 'https://placehold.co/200x200/0984E3/FFFFFF/png?text=ED',
    content: 'DesignAgency helped us create a stunning website that perfectly represents our brand. Their expertise in UI/UX design is truly impressive.',
  },
]

export function TestimonialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [activeIndex, setActiveIndex] = useState(0)

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
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what some of our clients have to say about working with us.
          </p>
        </MotionDiv>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <MotionDiv
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg ${
                  activeIndex === index ? 'ring-2 ring-secondary' : ''
                }`}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
              </MotionDiv>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  activeIndex === index ? 'bg-secondary' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 