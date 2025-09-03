import React from 'react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-luxury-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Contact 
            <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Us</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Get in touch with our real estate experts
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-300 text-lg">
                  Ready to find your dream property in Dubai? Our expert team is here to help you every step of the way.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-ocean/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Email</h3>
                    <a href="mailto:admin@premiumchoice.ae" className="text-green-ocean hover:text-green-ocean-light transition-colors">
                      admin@premiumchoice.ae
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-ocean/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Phone</h3>
                    <a href="tel:+971506498660" className="text-green-ocean hover:text-green-ocean-light transition-colors">
                      +971 5064986660
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-ocean/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Location</h3>
                    <p className="text-gray-300">Dubai, UAE</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-ocean/10 rounded-lg p-6 border border-green-ocean/20">
                <h3 className="text-white font-semibold mb-2">Business Hours</h3>
                <div className="space-y-1 text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-luxury-black-light rounded-xl p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full bg-luxury-black text-white px-4 py-3 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-ocean text-white py-3 rounded-lg font-semibold hover:bg-green-ocean-light transition-colors"
              >
                Send Message
              </button>
            </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}