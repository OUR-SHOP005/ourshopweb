import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/ThemeProvider'
import { Footer } from '../components/Footer'
import { ChatPopup } from '../components/ChatPopup'
import { ConsentBanner } from '../components/ConsentBanner'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OurShop - Web Design & Development Agency',
  description: 'Award-winning web design agency helping businesses succeed in the digital world through innovative design and development solutions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex-grow">
              {children}
            </div>
            <Footer />
            <ChatPopup />
            <ConsentBanner />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
} 