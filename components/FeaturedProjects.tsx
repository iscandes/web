'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Project {
  id: number;
  name: string;
  slug: string;
  location: string;
  price: string;
  image: string;
  developer: string;
  status: string;
  description: string;
  roi: string;
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Get first 3 projects for featured section
        setProjects(data.slice(0, 3));
      } catch (error) {
        // Silently handle errors - no fallback data, only show real database content
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-ocean mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading featured projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Featured Investment 
            <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Projects</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover premium investment opportunities with guaranteed returns
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-200/50"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden">
                {project.image && project.image !== '/images/property-placeholder.svg' ? (
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-ocean/20 to-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-600">
                      <div className="w-16 h-16 mx-auto mb-4 bg-green-ocean/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-6 4h6" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">Project Image</p>
                    </div>
                  </div>
                )}
                

              </div>

              {/* Project Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-ocean transition-colors">
                  {project.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-2 text-green-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm">{project.location}</span>
                </div>

                <div className="text-green-ocean font-semibold text-lg mb-4">
                  {project.price}
                </div>

                {/* Developer */}
                <div className="mb-4">
                  <span className="bg-green-ocean/10 text-green-ocean px-3 py-1 rounded-full text-xs">
                    {project.developer}
                  </span>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/projects/${project.slug}`}
                  className="w-full bg-green-ocean text-white py-3 rounded-lg font-semibold text-center block hover:bg-green-ocean-light transition-colors duration-200"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 border-2 border-green-ocean text-green-ocean px-8 py-3 rounded-lg font-semibold hover:bg-green-ocean hover:text-white transition-all duration-200"
          >
            <span>View All Projects</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}