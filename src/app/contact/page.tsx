'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { FiMail } from 'react-icons/fi'
import Link from 'next/link'

const MotionSection = motion.section

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
    mailtoLink?: string
  } | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: 'Thank you! Your message has been sent successfully.',
        })
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || 'Failed to send message. Please try again.',
          mailtoLink: data.mailtoLink
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'An error occurred. Please try again.',
      })
    }

    setIsSubmitting(false)
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Contact Us Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-500 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600">
            Have a question or want to know more? Get in touch with us!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Get in Touch */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              We'd love to hear from you. Fill out the form and we'll get back to you as
              soon as possible.
            </p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Contact Information</h3>
                <p className="flex items-center text-gray-600">
                  <span className="mr-2">Email:</span> 
                  <a href="mailto:ourshop005@gmail.com" className="text-gray-600 hover:text-blue-500">
                    ourshop005@gmail.com
                  </a>
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-gray-600">Saturday - Sunday: Closed</p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600 transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              
              {submitStatus && (
                <div
                  className={`mt-4 p-4 rounded ${
                    submitStatus.success
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {submitStatus.message}
                  {submitStatus.mailtoLink && (
                    <div className="mt-2">
                      <a 
                        href={submitStatus.mailtoLink}
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        Click here to send your message via email
                      </a>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-2">What services do you offer?</h3>
              <p className="text-gray-600">
                We offer a full range of digital services including web design, development, branding, and digital marketing.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">How long does a typical project take?</h3>
              <p className="text-gray-600">
                Project timelines vary depending on scope and complexity. Most projects take 4-12 weeks from start to finish.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">Do you offer maintenance services?</h3>
              <p className="text-gray-600">
                Yes, we offer ongoing maintenance and support packages to keep your digital assets running smoothly.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-2">What is your pricing structure?</h3>
              <p className="text-gray-600">
                We provide custom quotes based on project requirements. Contact us to discuss your specific needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 