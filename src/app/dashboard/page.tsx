'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { Navigation } from '../../components/Navigation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MarketingConsentForm } from '@/components/MarketingConsentForm'

// Helper function to safely format dates
function formatDate(dateValue: any): string {
  if (!dateValue) return 'Not available';
  
  try {
    // Convert to string first to be safe
    return new Date(String(dateValue)).toLocaleDateString();
  } catch (e) {
    return 'Invalid date';
  }
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in')
    }

    // Check if user has admin privileges
    if (user) {
      const userRole = user.publicMetadata?.role as string
      setIsAdmin(userRole === 'admin' || userRole === 'main_admin')
    }
  }, [isLoaded, user, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const handleDeleteAccount = async () => {
    try {
      await user?.delete()
      router.push('/')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again.')
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold">Welcome, {user.firstName || 'User'}</h1>
                  <p className="text-white/80">Your personal dashboard</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>

              {/* User Profile */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Full Name</p>
                    <p className="font-medium">{user.fullName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Email Address</p>
                    <p className="font-medium">{user.primaryEmailAddress?.emailAddress || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Member Since</p>
                    <p className="font-medium">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                  {isAdmin && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Role</p>
                      <p className="font-medium">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                          {user.publicMetadata?.role === 'main_admin' ? 'Main Admin' : 'Admin'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Marketing Preferences */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Email Preferences</h2>
                <MarketingConsentForm onDashboard={true} />
              </div>

              {/* Admin Quick Actions */}
              {isAdmin && (
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-secondary/5 to-primary/5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-secondary">Admin Actions</h2>
                    <Link
                      href="/admin?tab=overview"
                      className="text-sm font-medium text-secondary hover:text-secondary/90 dark:text-secondary dark:hover:text-secondary/90 transition-colors"
                    >
                      Go to Full Admin Panel →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a
                      href="/admin?tab=projects"
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <h3 className="font-medium">Projects</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage projects</p>
                    </a>
                    <a
                      href="/admin?tab=ads"
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      <h3 className="font-medium">Advertisements</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage ads</p>
                    </a>
                    <a
                      href="/admin?tab=inbox"
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-medium">Inbox</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">View messages</p>
                    </a>
                    <a
                      href="/admin?tab=services"
                      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-md transition-all flex flex-col items-center justify-center text-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="font-medium">Services</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage services</p>
                    </a>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/contact"
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-medium mb-1">Contact Support</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get help with your account</p>
                  </Link>
                  <Link
                    href="/services"
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-medium mb-1">View Services</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">See our latest offerings</p>
                  </Link>
                  <Link
                    href="/portfolio"
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-medium mb-1">Portfolio</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View our projects</p>
                  </Link>
                </div>
              </div>

              {/* Recent Activity - Placeholder */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-600 dark:text-gray-400">No recent activity to display.</p>
              </div>

              {/* Account Management */}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Management</h2>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
                >
                  Delete Account
                </button>

                {showDeleteConfirm && (
                  <div className="mt-4 p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-900/30">
                    <p className="text-red-800 dark:text-red-400 mb-4">
                      Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div className="flex space-x-4">
                      <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Yes, Delete My Account
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 