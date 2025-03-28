'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from './ThemeToggle'

const navLinks = [
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Open menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-xl z-50"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <Link href="/" className="text-2xl font-heading font-bold">
                    DesignAgency
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-4">
                  <ul className="space-y-4">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-lg font-medium hover:text-secondary transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <ThemeToggle />
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      © {new Date().getFullYear()} DesignAgency
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
} 