
import React from 'react'
import HeroSection from '../components/HeroSection'
import FeaturedProjects from '../components/FeaturedProjects'
import CTASection from '../components/CTASection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturedProjects />
      <CTASection />
    </div>
  )
}
