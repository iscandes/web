
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSocialMedia } from '../lib/useSocialMedia'

interface SocialMediaSettings {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
  snapchat?: string;
  telegram?: string;
  whatsapp?: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const { socialMedia, loading, error } = useSocialMedia(true) // Enable auto-sync
  
  // Log social media data for debugging
  useEffect(() => {
    if (!loading && Object.keys(socialMedia).length > 0) {
      const activeLinks = Object.entries(socialMedia).filter(([key, url]) => url && url.trim() !== '');
      console.log('Footer: Active social media links:', activeLinks.length, activeLinks);
    }
  }, [socialMedia, loading])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Don't render footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  // Show floating menu only on expert page
  const showFloatingMenu = pathname === '/expert'



  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Articles', href: '/articles' },
    { name: 'Developers', href: '/developers' },
    { name: 'Expert', href: '/expert' },
    { name: 'Contact', href: '/contact' },
  ]

  const services = [
    'Property Investment',
    'Real Estate Consultation',
    'Property Management',
    'Market Analysis',
    'Legal Support',
  ]

  return (
    <footer className="bg-white/90 backdrop-blur-sm border-t border-green-ocean/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-ocean rounded-full flex items-center justify-center">
                <span className="text-white font-bold">PC</span>
              </div>
              <span className="text-gray-900 font-bold text-xl">Premium Choice</span>
            </Link>
            <p className="text-gray-600 mb-6 max-w-md">
              Your trusted partner in Dubai real estate. We specialize in luxury properties, 
              investment opportunities, and providing exceptional service to help you find 
              your perfect home or investment.
            </p>
            <div className="flex flex-wrap gap-3">
              {!loading && (
                <>
                  {socialMedia.facebook && (
                    <Link href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="Facebook">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.instagram && (
                    <Link href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="Instagram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.twitter && (
                    <Link href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="Twitter">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.linkedin && (
                    <Link href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="LinkedIn">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.tiktok && (
                    <Link href={socialMedia.tiktok} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="TikTok">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                    </Link>
                  )}

                  {socialMedia.telegram && (
                    <Link href={socialMedia.telegram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="Telegram">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                    </Link>
                  )}
                  {socialMedia.whatsapp && (
                    <Link href={socialMedia.whatsapp} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-ocean/10 rounded-full flex items-center justify-center text-green-ocean hover:bg-green-ocean hover:text-white transition-colors duration-200" title="WhatsApp">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                      </svg>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-green-ocean transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-900 font-semibold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service} className="text-gray-600">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-ocean/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © {currentYear} Premium Choice Real Estate. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-600 hover:text-green-ocean text-sm transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-green-ocean text-sm transition-colors duration-200">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      {/* Floating Menu for Expert Page */}
      {showFloatingMenu && (
        <>
          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-green-ocean hover:bg-green-ocean-light text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center group"
            title="Expert Menu"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`}></i>
          </button>

          {/* Floating Menu Panel */}
          <div className={`fixed bottom-24 right-6 w-72 bg-white/95 backdrop-blur-xl border border-green-ocean/20 rounded-xl shadow-2xl transform transition-all duration-300 z-40 ${
            isMenuOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-95 pointer-events-none'
          }`}>
            <div className="p-6">
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Expert Menu</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-ocean rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-ocean font-medium">AI Active</span>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-3">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-green-ocean/10 border border-gray-200 hover:border-green-ocean/30 rounded-lg text-gray-700 hover:text-green-ocean transition-all duration-200 flex items-center space-x-3 group"
                >
                  <i className="ri-home-line text-lg group-hover:scale-110 transition-transform"></i>
                  <span className="font-medium">Home</span>
                </Link>

                <button
                  onClick={() => {
                    // Reset chat functionality
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 bg-green-ocean/10 hover:bg-green-ocean border border-green-ocean/30 hover:border-green-ocean rounded-lg text-green-ocean hover:text-white transition-all duration-200 flex items-center space-x-3 group"
                >
                  <i className="ri-refresh-line text-lg group-hover:rotate-180 transition-transform duration-300"></i>
                  <span className="font-medium">New Chat</span>
                </button>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-3 py-2 text-left text-gray-600 hover:text-green-ocean hover:bg-green-ocean/5 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <i className="ri-search-line text-sm group-hover:scale-110 transition-transform"></i>
                      <span className="text-sm">Search Properties</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-gray-600 hover:text-green-ocean hover:bg-green-ocean/5 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <i className="ri-calculator-line text-sm group-hover:scale-110 transition-transform"></i>
                      <span className="text-sm">Mortgage Calculator</span>
                    </button>
                    <button className="w-full px-3 py-2 text-left text-gray-600 hover:text-green-ocean hover:bg-green-ocean/5 rounded-lg transition-all duration-200 flex items-center space-x-3 group">
                      <i className="ri-map-pin-line text-sm group-hover:scale-110 transition-transform"></i>
                      <span className="text-sm">Area Guide</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Menu Footer */}
              <div className="border-t border-gray-200 pt-4 mt-6">
                <div className="text-center">
                  <p className="text-xs text-gray-500">AI Real Estate Expert</p>
                  <p className="text-xs text-green-ocean font-medium">Powered by Advanced AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {isMenuOpen && (
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            ></div>
          )}
        </>
      )}
    </footer>
  )
}
