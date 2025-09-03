
import type { Metadata, Viewport } from 'next'
import { 
  Inter, 
  Playfair_Display, 
  Cormorant_Garamond, 
  Crimson_Text, 
  Libre_Baskerville,
  Montserrat,
  Source_Sans_3,
  Lato,
  Open_Sans,
  Source_Serif_4,
  Merriweather,
  PT_Serif
} from 'next/font/google'
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

// Luxury Typography Fonts
const cormorantGaramond = Cormorant_Garamond({ 
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
})

const crimsonText = Crimson_Text({ 
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
  weight: ['400', '600', '700']
})

const libreBaskerville = Libre_Baskerville({ 
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
  display: 'swap',
  weight: ['400', '700']
})

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700']
})

const sourceSans3 = Source_Sans_3({ 
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700']
})

const lato = Lato({ 
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['300', '400', '700']
})

const openSans = Open_Sans({ 
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['300', '400', '600', '700']
})

const sourceSerif4 = Source_Serif_4({ 
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
  weight: ['400', '600', '700']
})

const merriweather = Merriweather({ 
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['300', '400', '700']
})

const ptSerif = PT_Serif({ 
  subsets: ['latin'],
  variable: '--font-pt-serif',
  display: 'swap',
  weight: ['400', '700']
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
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorantGaramond.variable} ${crimsonText.variable} ${libreBaskerville.variable} ${montserrat.variable} ${sourceSans3.variable} ${lato.variable} ${openSans.variable} ${sourceSerif4.variable} ${merriweather.variable} ${ptSerif.variable}`}>
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
