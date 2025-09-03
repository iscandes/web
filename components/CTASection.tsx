import React from 'react'
import Link from 'next/link'

export default function CTASection() {
  return React.createElement('section', {
    className: 'py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black relative overflow-hidden'
  },
    React.createElement('div', {
      className: 'relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'
    },
      React.createElement('div', {
        className: 'space-y-8'
      },
        React.createElement('h2', {
          className: 'text-3xl md:text-4xl lg:text-5xl font-bold text-white'
        },
          'Ready to Find Your',
          React.createElement('span', {
            className: 'bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent'
          }, ' Dream Property?')
        ),
        React.createElement('p', {
          className: 'text-lg md:text-xl text-gray-300 max-w-3xl mx-auto'
        }, 'Join thousands of successful investors who have secured their future with Dubai\'s premium real estate developments. Get expert guidance and exclusive access to the best investment opportunities.'),
        React.createElement('div', {
          className: 'flex flex-col sm:flex-row gap-4 justify-center items-center mt-12'
        },

          React.createElement(Link, {
            href: '/contact',
            className: 'border-2 border-green-ocean text-green-ocean px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-ocean hover:text-white'
          }, 'Contact Us')
        )
      )
    )
  )
}