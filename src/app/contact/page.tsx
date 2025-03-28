'use client'

import { MotionDiv } from '@/components/ui/MotionWrapper'
import { Navigation } from '@/components/Navigation'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Create a mailto link with the form data
      const mailtoLink = `mailto:ourshop005@gmail.com?subject=${encodeURIComponent(
        formData.subject
      )}&body=${encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
      )}`

      // Open the default email client
      window.location.href = mailtoLink

      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      setStatus('success')
    } catch (error) {
      console.error('Error sending email:', error)
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">Contact Us</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Have a question or want to know more? Get in touch with us!
            </p>
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Get in Touch</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  We'd love to hear from you. Fill out the form and we'll get back to you as soon as possible.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Contact Information</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Email: ourshop005@gmail.com
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Business Hours</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Monday - Friday: 9:00 AM - 6:00 PM<br />
                  Saturday - Sunday: Closed
                </p>
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-secondary focus:border-transparent"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full px-8 py-3 rounded-full bg-secondary text-white hover:bg-secondary/90 transition-colors ${
                    status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                  <p className="text-green-500 text-center">Message sent successfully!</p>
                )}
                {status === 'error' && (
                  <p className="text-red-500 text-center">Error sending message. Please try again.</p>
                )}
              </form>
            </MotionDiv>
          </div>

          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto mt-20"
          >
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 text-center">Frequently Asked Questions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold mb-2">What services do you offer?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We offer a full range of digital services including web design, development, branding, and digital marketing.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">How long does a typical project take?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Project timelines vary depending on scope and complexity. Most projects take 4-12 weeks from start to finish.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">Do you offer maintenance services?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Yes, we offer ongoing maintenance and support packages to keep your digital assets running smoothly.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold mb-2">What is your pricing structure?</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We provide custom quotes based on project requirements. Contact us to discuss your specific needs.
                  </p>
                </div>
              </div>
            </div>
          </MotionDiv>
        </div>
      </main>
    </>
  )
} 