'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';

interface Developer {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  established?: string;
  projects_count: number;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: 'Active' | 'Inactive';
}

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
  bedrooms?: number;
  bathrooms?: number;
  area?: string;
  features?: string[];
  amenities?: string[];
}

export default function DeveloperDetailPage() {
  const params = useParams();
  const developerSlug = params.slug as string;
  
  const [developer, setDeveloper] = useState<Developer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeveloperAndProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch developer details
        const developersResponse = await fetch('/api/developers');
        if (!developersResponse.ok) {
          throw new Error('Failed to fetch developers');
        }
        
        const developers = await developersResponse.json();
        const foundDeveloper = developers.find((dev: Developer) => dev.slug === developerSlug);
        
        if (!foundDeveloper) {
          throw new Error('Developer not found');
        }
        
        setDeveloper(foundDeveloper);

        // Fetch projects for this developer
        const projectsResponse = await fetch(`/api/developers/${encodeURIComponent(foundDeveloper.name)}/projects`);
        if (!projectsResponse.ok) {
          throw new Error('Failed to fetch projects');
        }
        
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);

      } catch (error) {
        console.error('Error fetching developer data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (developerSlug) {
      fetchDeveloperAndProjects();
    }
  }, [developerSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-ocean border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-white text-xl">Loading developer details...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !developer) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">Developer Not Found</h1>
              <p className="text-gray-300 mb-8">{error || 'The requested developer could not be found.'}</p>
              <Link
                href="/developers"
                className="inline-flex items-center space-x-2 bg-green-ocean text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-ocean-light transition-colors"
              >
                <span>Back to Developers</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white">
      {/* Developer Header */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Developer Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 lg:w-48 lg:h-48 bg-luxury-black-light rounded-xl overflow-hidden border border-green-ocean/20">
                <Image 
                  src={developer.logo || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&q=80"} 
                  alt={developer.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 192px"
                />
              </div>
            </div>

            {/* Developer Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {developer.name}
              </h1>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                {developer.location && (
                  <div className="flex items-center text-gray-300">
                    <i className="ri-map-pin-line mr-2 text-green-ocean"></i>
                    {developer.location}
                  </div>
                )}
                {developer.established && (
                  <div className="flex items-center text-gray-300">
                    <i className="ri-calendar-line mr-2 text-green-ocean"></i>
                    Est. {developer.established}
                  </div>
                )}
                <div className="flex items-center text-green-ocean font-semibold">
                  <i className="ri-building-line mr-2"></i>
                  {projects.length} Project{projects.length !== 1 ? 's' : ''}
                </div>
              </div>

              {developer.description && (
                <p className="text-lg text-gray-300 max-w-3xl mb-6">
                  {developer.description}
                </p>
              )}

              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                {developer.website && (
                  <a 
                    href={developer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-green-ocean text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-ocean-light transition-colors"
                  >
                    <i className="ri-external-link-line"></i>
                    <span>Visit Website</span>
                  </a>
                )}
                <Link
                  href="/developers"
                  className="inline-flex items-center space-x-2 border-2 border-green-ocean text-green-ocean px-6 py-3 rounded-lg font-semibold hover:bg-green-ocean hover:text-white transition-all"
                >
                  <i className="ri-arrow-left-line"></i>
                  <span>Back to Developers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Projects by 
              <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> {developer.name}</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover premium investment opportunities from this trusted developer
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-luxury-black-light rounded-full flex items-center justify-center">
                <i className="ri-building-line text-3xl text-green-ocean"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Projects Found</h3>
              <p className="text-gray-300 mb-8">This developer doesn&apos;t have any projects listed yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-luxury-black-light rounded-xl overflow-hidden hover:bg-luxury-black-light/80 transition-all duration-300 hover:scale-105 group border border-gray-700/50"
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
                      <div className="w-full h-full bg-gradient-to-br from-green-ocean/20 to-gray-800 flex items-center justify-center">
                        <div className="text-center text-gray-400">
                          <div className="w-16 h-16 mx-auto mb-4 bg-green-ocean/20 rounded-full flex items-center justify-center">
                            <i className="ri-building-line text-2xl text-green-ocean"></i>
                          </div>
                          <p className="text-sm">Project Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* ROI Badge */}
                    <div className="absolute top-4 right-4 bg-green-ocean text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.roi} ROI
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-ocean transition-colors">
                      {project.name}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 mb-3">
                      <i className="ri-map-pin-line mr-2 text-green-ocean"></i>
                      <span className="text-sm">{project.location}</span>
                    </div>

                    <div className="text-green-ocean font-semibold text-lg mb-4">
                      {project.price}
                    </div>

                    {/* Project Stats */}
                    {(project.bedrooms || project.bathrooms || project.area) && (
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        {project.bedrooms && (
                          <div className="flex items-center">
                            <i className="ri-hotel-bed-line mr-1 text-green-ocean"></i>
                            {project.bedrooms} BR
                          </div>
                        )}
                        {project.bathrooms && (
                          <div className="flex items-center">
                            <i className="ri-drop-line mr-1 text-green-ocean"></i>
                            {project.bathrooms} BA
                          </div>
                        )}
                        {project.area && (
                          <div className="flex items-center">
                            <i className="ri-ruler-line mr-1 text-green-ocean"></i>
                            {project.area}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className="bg-green-ocean/10 text-green-ocean px-3 py-1 rounded-full text-xs">
                        {project.status}
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
          )}
        </div>
      </section>
    </div>
  );
}