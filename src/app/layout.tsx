import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '../components/ThemeProvider'
import { Footer } from '../components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OurShop - Local Shopping in Shoremere',
  description: 'Your local shopping destination in Shoremere offering quality products and services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
} 