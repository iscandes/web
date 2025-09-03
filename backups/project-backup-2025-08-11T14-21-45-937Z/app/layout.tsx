
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import FloatingChat from '../components/FloatingChat'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#00A693',
}

export const metadata: Metadata = {
  title: 'Premium Choice Real Estate - Luxury Properties in Dubai',
  description: 'Discover premium investment opportunities with guaranteed returns. Premium locations, exceptional returns, and world-class amenities await.',
  keywords: 'Dubai real estate, luxury properties, investment opportunities, premium developments',
  authors: [{ name: 'Premium Choice Real Estate' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Premium Choice Real Estate - Luxury Properties in Dubai',
    description: 'Discover premium investment opportunities with guaranteed returns.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Premium Choice Real Estate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Choice Real Estate - Luxury Properties in Dubai',
    description: 'Discover premium investment opportunities with guaranteed returns.',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://cdn.jsdelivr.net/npm/remixicon@4.0.0/fonts/remixicon.css" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingChat />
        </div>
      </body>
    </html>
  )
}
